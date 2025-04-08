'use client'

import { useState, useRef, useEffect } from 'react'

export default function ColumnMenu() {
  const [open, setOpen] = useState(false)
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
          <button className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100">
            Rename Column
          </button>
          <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100">
            Delete Column
          </button>
        </div>
      )}
    </div>
  )
}
