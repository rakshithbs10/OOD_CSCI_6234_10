'use client'

import { useState } from 'react'
import Header from '@/components/Header/Header'
import Sidebar from '@/components/Sidebar/Sidebar'
import { FaUsers, FaUserFriends } from 'react-icons/fa'

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<'Users' | 'Teams'>('Users')
  const [query, setQuery] = useState('')

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="flex">
        <Sidebar />

        <main className="p-6 flex-1">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Search</h1>
          <p className="text-gray-600 mb-6">Find users or teams by name</p>

          {/* Tabs */}
          <div className="flex space-x-4 bg-gray-100 px-2 py-1 rounded-xl w-fit mb-8">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                activeTab === 'Users'
                  ? 'bg-white shadow text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
              onClick={() => setActiveTab('Users')}
            >
              <FaUsers className="text-sm" />
              Users
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                activeTab === 'Teams'
                  ? 'bg-white shadow text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
              onClick={() => setActiveTab('Teams')}
            >
              <FaUserFriends className="text-sm" />
              Teams
            </button>
          </div>

          {/* Search Section */}
          <div className="max-w-xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-black"
            />

            {/* Placeholder dropdown logic */}
            {query && (
              <div className="mt-2 bg-white border border-gray-300 rounded shadow-sm max-h-60 overflow-y-auto">
                <p className="p-3 text-gray-500 text-sm">
                  This will show matching {activeTab.toLowerCase()} once connected to backend.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
