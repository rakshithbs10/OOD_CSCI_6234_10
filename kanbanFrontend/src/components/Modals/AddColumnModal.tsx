import React, { useEffect, useState } from 'react'

export default function AddColumnModal({
  isOpen,
  onClose,
  onAdd
}: {
  isOpen: boolean
  onClose: () => void
  onAdd: (name: string) => void
}) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  // ⬇️ Reset the form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setName('')
      setError('')
    }
  }, [isOpen])

  const handleAdd = () => {
    if (!name.trim()) {
      setError('Column name is required.')
      return
    }
    onAdd(name.trim())
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.35)] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-500 text-xl font-bold">&times;</button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Column</h2>
        <input
          type="text"
          placeholder="Column Name"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400 text-black"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        <button
          onClick={handleAdd}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Add Column
        </button>
      </div>
    </div>
  )
}
