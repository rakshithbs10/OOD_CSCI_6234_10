'use client'

import { useState } from 'react'
import Header from '@/components/Header/Header'
import Sidebar from '@/components/Sidebar/Sidebar'

const tabs = ['Profile', 'Notifications', 'Security']

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile')

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="flex">
        <Sidebar />

        <main className="p-6 flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600 mb-6">Manage your account and preferences</p>

          {/* Tab Navigation */}
          <div className="flex space-x-4 bg-gray-100 p-2 rounded-md w-fit mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1 rounded ${
                  activeTab === tab
                    ? 'bg-white shadow text-black font-medium'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'Profile' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring text-black"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring text-black"
                  placeholder="Enter your last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring text-black"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring text-black"
                  placeholder="E.g. Product Manager"
                />
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { title: 'Assigned Tasks', desc: "Get notified when you're assigned to a task" },
                  { title: 'Task Comments', desc: "Get notified when someone comments on your task" },
                  { title: 'Due Date Reminders', desc: 'Get reminded about approaching due dates' },
                  { title: 'Board Invitations', desc: "Get notified when you're invited to a board" }
                ].map(({ title, desc }) => (
                  <div key={title} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{title}</p>
                      <p className="text-sm text-gray-600">{desc}</p>
                    </div>
                    <input type="checkbox" className="toggle-checkbox accent-purple-600 w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring text-black"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring text-black"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring text-black"
                  placeholder="••••••••"
                />
              </div>

              <button className="mt-4 bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700">
                Update Password
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
