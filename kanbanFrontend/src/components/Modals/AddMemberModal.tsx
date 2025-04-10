'use client'

import { useEffect, useRef, useState } from 'react'

export default function AddMemberModal({
  isOpen,
  onClose,
  boardId
}: {
  isOpen: boolean
  onClose: () => void
  boardId: number
}) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          query.trim()
            ? `http://localhost:5001/api/users/search?q=${query}`
            : `http://localhost:5001/api/users/search`
        )
        const data = await res.json()
        setSuggestions(data)
      } catch (err) {
        console.error('Failed to fetch users', err)
      }
    }

    fetchSuggestions()
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleAdd = async () => {
    if (!selectedUser) return
    try {
      const res = await fetch(`http://localhost:5001/api/boards/${boardId}/add-member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id })
      })
      if (res.ok) {
        window.location.reload()
      } else {
        console.error('Failed to add member')
      }
    } catch (err) {
      console.error('Error adding member:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.35)] flex items-center justify-center z-50">
      <div ref={wrapperRef} className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <button
          className="absolute right-4 top-3 text-xl font-bold text-gray-600 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4 text-gray-800">Add Member</h2>

        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedUser(null)
          }}
          className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring focus:border-blue-500"
        />

        {suggestions.length > 0 && (
          <div className="border border-gray-300 rounded max-h-40 overflow-y-auto bg-white shadow mb-4 mt-2">
            {suggestions.map((user) => (
              <div
                key={user.id}
                className={`px-3 py-2 text-black cursor-pointer hover:bg-gray-100 ${
                  selectedUser?.id === user.id ? 'bg-gray-200' : ''
                }`}
                onClick={() => setSelectedUser(user)}
              >
                {user.username}
              </div>
            ))}
          </div>
        )}

        <button
          className={`w-full mt-2 px-4 py-2 rounded ${
            selectedUser
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-white cursor-not-allowed'
          }`}
          onClick={handleAdd}
          disabled={!selectedUser}
        >
          Add
        </button>
      </div>
    </div>
  )
}
