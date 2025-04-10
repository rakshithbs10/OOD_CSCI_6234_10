'use client'

import { useEffect, useRef, useState } from 'react'
import Modal from '../Modal/Modal'

interface User {
  id: number
  username: string
  email: string
}

export default function CreateBoardModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [boardName, setBoardName] = useState('')
  const [summary, setSummary] = useState('')
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])

  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentUser = typeof window !== 'undefined'
    ? JSON.parse(sessionStorage.getItem('user') || '{}')
    : null

  const fetchUsers = async (query: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/users/search?q=${query}`)
      const data = await res.json()
      const filtered = data
        .filter((u: User) => u.id !== currentUser?.id)
        .sort((a: User, b: User) => a.username.localeCompare(b.username))
      setUsers(filtered)
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  const handleAddUser = (user: User) => {
    setSelectedUsers((prev) => [...prev, user])
    setSearch('')
    setDropdownOpen(false)
  }

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  const handleCreateBoard = async () => {
    if (!boardName.trim()) {
      alert('Board name is required.')
      return
    }
  
    try {
      const userIds = selectedUsers.map((u) => u.id)
      const payload = {
        name: boardName,
        summary,
        ownerId: currentUser?.id,
        userIds: Array.from(new Set([...userIds, currentUser?.id]))
      }
  
      const res = await fetch('http://localhost:5001/api/boards/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
  
      if (res.ok) {
        const data = await res.json()
        const boardId = data.board?.id || data.id // adjust depending on your backend structure
  
        // ✅ Create default columns
        const defaultColumns = ['To Do', 'Completed', 'In Progress']
        await Promise.all(
          defaultColumns.map((name) =>
            fetch('http://localhost:5001/api/boards/column/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ boardId, name })
            })
          )
        )
  
        // 🧹 Cleanup and close modal
        onClose()
        setBoardName('')
        setSummary('')
        setSearch('')
        setUsers([])
        setSelectedUsers([])
        window.location.reload()
      } else {
        console.error('Failed to create board')
      }
    } catch (err) {
      console.error('Error creating board:', err)
    }
  }
  
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Board</h2>

      <input
        type="text"
        placeholder="Board Name"
        className="w-full px-3 py-2 mb-3 border border-gray-300 rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
      />

      {/* Search Dropdown */}
      <div className="relative mb-2" ref={dropdownRef}>
        <div
          className="flex items-center justify-between border border-gray-300 rounded px-3 py-2 cursor-pointer"
          onClick={() => {
            setDropdownOpen(true)
            if (users.length === 0 && !search.trim()) {
              fetchUsers('')
            }
          }}
        >
          <input
            type="text"
            placeholder="Search users"
            className="w-full text-gray-800 placeholder-gray-500 focus:outline-none"
            value={search}
            onChange={(e) => {
              const value = e.target.value
              setSearch(value)
              fetchUsers(value)
            }}
            onFocus={() => setDropdownOpen(true)}
          />
          <span className="text-gray-500 ml-2">▼</span>
        </div>

        {dropdownOpen && users.length > 0 && (
          <div className="absolute z-10 bg-white border border-gray-300 mt-1 rounded shadow max-h-40 overflow-y-auto w-full">
            {users.map((user) => (
              <div
                key={user.id}
                className="px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleAddUser(user)}
              >
                {user.username}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Users */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedUsers.map((user) => (
          <span
            key={user.id}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
          >
            {user.username}
            <button
              onClick={() => handleRemoveUser(user.id)}
              className="ml-2 text-xs font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <textarea
        placeholder="Project Summary"
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      <button
        onClick={handleCreateBoard}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
      >
        Add Board
      </button>
    </Modal>
  )
}
