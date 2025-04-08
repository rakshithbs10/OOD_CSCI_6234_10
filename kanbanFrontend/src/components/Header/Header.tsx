'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaCog } from 'react-icons/fa'

export default function Header() {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    setShowModal(false)
    router.push('/login') // Redirect to login page
  }

  return (
    <>
      <header className="w-full h-16 bg-black text-white flex items-center justify-between px-6 shadow-md">
        {/* Left: App name */}
        <h1 className="text-xl font-bold tracking-wide">Kanban Task Board</h1>

        {/* Right: Actions */}
        <div className="flex items-center space-x-6">
          {/* Settings Link */}
          <Link href="/settings">
            <FaCog className="text-lg cursor-pointer hover:text-gray-300" title="Settings" />
          </Link>

          {/* Sign out button */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg relative">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to log out?</p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 text-xl font-bold hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  )
}
