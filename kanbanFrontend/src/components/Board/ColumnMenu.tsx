'use client'

import { useState, useRef, useEffect } from 'react'

export default function ColumnMenu({
  onRename,
  onDelete
}: {
  onRename: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-500 hover:text-gray-700 text-lg"
        aria-label="Open column menu"
      >
        ⋯
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <button
            onClick={() => {
              onRename()
              setOpen(false)
            }}
            className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
          >
            Rename Column
          </button>
          <button
            onClick={() => {
              setConfirmDelete(true)
              setOpen(false)
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
          >
            Delete Column
          </button>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.35)] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4 text-gray-800 font-semibold">Are you sure you want to delete this column?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 text-black hover:bg-gray-400"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  onDelete()
                  setConfirmDelete(false)
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
