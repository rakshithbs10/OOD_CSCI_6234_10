'use client'

import { useEffect, useRef, useState } from 'react'

export default function RemoveMemberModal({
  isOpen,
  onClose,
  boardId
}: {
  isOpen: boolean
  onClose: () => void
  boardId: number
}) {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          query.trim()
            ? `http://localhost:5001/api/boards/boards/${boardId}/users?q=${query}`
            : `http://localhost:5001/api/boards/boards/${boardId}/users`
        )
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        console.error('Failed to fetch board users', err)
      }
    }

    fetchUsers()
  }, [query, boardId])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedUser(null)
    }
  }, [isOpen])

  const handleRemove = async () => {
    if (!selectedUser) return
    try {
      const res = await fetch(`http://localhost:5001/api/boards/${boardId}/remove-member`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id })
      })
      if (res.ok) {
        window.location.reload()
      } else {
        console.error('Failed to remove member')
      }
    } catch (err) {
      console.error('Error removing member:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.35)] flex items-center justify-center z-50">
      <div ref={wrapperRef} className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <button
          className="absolute right-4 top-3 text-xl font-bold text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-lg font-bold mb-4 text-gray-800">Remove Member</h2>

        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring"
        />

        {users.length > 0 && (
          <div className="border border-gray-300 rounded mt-2 max-h-40 overflow-y-auto bg-white shadow">
            {users.map((user) => (
              <div
                key={user.id}
                className={`px-3 py-2 text-black cursor-pointer hover:bg-gray-100 ${
                  selectedUser?.id === user.id ? 'bg-gray-200' : ''
                }`}
                onMouseDown={(e) => {
                  // prevent blur or closing
                  e.preventDefault()
                  setSelectedUser(user)
                }}
              >
                {user.username}
              </div>
            ))}
          </div>
        )}

        <button
          className={`w-full mt-4 px-4 py-2 rounded ${
            selectedUser
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-300 text-white cursor-not-allowed'
          }`}
          onClick={handleRemove}
          disabled={!selectedUser}
        >
          Remove
        </button>
      </div>
    </div>
  )
}
