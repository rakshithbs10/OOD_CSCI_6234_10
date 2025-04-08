import { useRef, useEffect, useState } from 'react'
import Modal from '../Modal/Modal'

const dummyUsers = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank']

export default function CreateTeamModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [teamName, setTeamName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredUsers = dummyUsers.filter(
    (u) => u.toLowerCase().includes(search.toLowerCase()) && !selectedMembers.includes(u)
  )

  const handleAddUser = (user: string) => {
    setSelectedMembers([...selectedMembers, user])
    setSearch('')
    setDropdownOpen(false)
  }

  const handleRemoveUser = (user: string) => {
    setSelectedMembers(selectedMembers.filter((u) => u !== user))
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
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Team</h2>

      <input
        type="text"
        placeholder="Team Name"
        className="w-full px-3 py-2 mb-3 border border-gray-300 rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />

      {/* Dropdown + Search */}
      <div className="relative mb-2" ref={dropdownRef}>
        <div
          className="flex items-center justify-between border border-gray-300 rounded px-3 py-2 cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <input
            type="text"
            placeholder="Search members"
            className="w-full text-gray-800 placeholder-gray-500 focus:outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setDropdownOpen(true)
            }}
            onFocus={() => setDropdownOpen(true)}
          />
          <span className="text-gray-500 ml-2">▼</span>
        </div>

        {dropdownOpen && filteredUsers.length > 0 && (
          <div className="absolute z-10 bg-white border border-gray-300 mt-1 rounded shadow max-h-40 overflow-y-auto w-full">
            {filteredUsers.map((user) => (
              <div
                key={user}
                className="px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleAddUser(user)}
              >
                {user}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Members */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedMembers.map((user) => (
          <span
            key={user}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
          >
            {user}
            <button
              onClick={() => handleRemoveUser(user)}
              className="ml-2 text-xs font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <textarea
        placeholder="Team Description"
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
        Add Team
      </button>
    </Modal>
  )
}
