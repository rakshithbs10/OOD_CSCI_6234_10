'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header/Header'
import Sidebar from '@/components/Sidebar/Sidebar'
import { FaUsers, FaUserFriends } from 'react-icons/fa'

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<'Users' | 'Teams'>('Users')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [focused, setFocused] = useState(false)

  const fetchResults = async () => {
    try {
      const baseUrl =
        activeTab === 'Users'
          ? 'http://localhost:5001/api/users/search'
          : 'http://localhost:5001/api/boards/search'

      const res = await fetch(query.trim() ? `${baseUrl}?q=${query}` : baseUrl)
      const data = await res.json()
      setResults(data)
    } catch (err) {
      console.error('Search failed:', err)
      setResults([])
    }
  }

  useEffect(() => {
    if (focused) {
      fetchResults()
    }
  }, [query, focused, activeTab])

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="flex">
        <Sidebar />

        <main className="p-6 flex-1">
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
              onClick={() => {
                setActiveTab('Users')
                setQuery('')
                setResults([])
              }}
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
              onClick={() => {
                setActiveTab('Teams')
                setQuery('')
                setResults([])
              }}
            >
              <FaUserFriends className="text-sm" />
              Projects
            </button>
          </div>

          {/* Search Box */}
          <div className="max-w-xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)} // brief delay to allow clicking on results
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-black"
            />

            {/* Search Results Dropdown */}
            {focused && results.length > 0 && (
              <div className="mt-2 bg-white border border-gray-300 rounded shadow-sm max-h-60 overflow-y-auto">
                {results.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-2 text-black cursor-default bg-white"
                  >
                    {activeTab === 'Users' ? item.username : item.name}
                  </div>
                ))}
              </div>
            )}

            {focused && results.length === 0 && (
              <div className="mt-2 bg-white border border-gray-300 rounded shadow-sm text-gray-500 px-4 py-2 text-sm">
                No results found.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
