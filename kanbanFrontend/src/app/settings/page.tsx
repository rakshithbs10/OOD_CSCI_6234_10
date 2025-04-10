'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header/Header'
import Sidebar from '@/components/Sidebar/Sidebar'

const tabs = ['Profile', 'Notifications', 'Security']

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile')
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState({
    notifyAssignedTasks: false,
    notifyTaskComments: false,
    notifyDueDates: false,
    notifyBoardInvites: false
  })
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      setNotifications({
        notifyAssignedTasks: parsed.notifyAssignedTasks,
        notifyTaskComments: parsed.notifyTaskComments,
        notifyDueDates: parsed.notifyDueDates,
        notifyBoardInvites: parsed.notifyBoardInvites
      })
    }
  }, [])

  const toggleNotification = async (field: keyof typeof notifications) => {
    const updated = { ...notifications, [field]: !notifications[field] }
    setNotifications(updated)

    try {
      const res = await fetch(`http://localhost:5001/api/users/${user.id}/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })

      if (!res.ok) {
        throw new Error('Failed to update notification preferences')
      }

      const updatedUser = { ...user, ...updated }
      setUser(updatedUser)
      sessionStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (err) {
      console.error(err)
    }
  }

  const updatePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwords

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match")
      return
    }

    try {
      const res = await fetch(`http://localhost:5001/api/users/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to update password')
      } else {
        alert('Password updated successfully')
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setError('')
      }
    } catch (err) {
      setError('Error updating password')
      console.error(err)
    }
  }

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

          {activeTab === 'Profile' && user && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input type="text" value={user.username} disabled className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" value={user.firstName || ''} disabled className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" value={user.lastName || ''} disabled className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={user.email} disabled className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input type="text" value={user.position || ''} disabled className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black" />
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{key.replace(/notify/, '').replace(/([A-Z])/g, ' $1')}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => toggleNotification(key as keyof typeof notifications)}
                    className="accent-purple-600 w-5 h-5"
                  />
                </div>
              ))}
            </div>
          )}

{activeTab === 'Security' && (
  <div className="space-y-4 max-w-xl">
    {error && <p className="text-red-500">{error}</p>}
    <input
      type="password"
      placeholder="Current Password"
      value={passwords.currentPassword}
      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
      className="w-full border border-gray-300 rounded px-3 py-2 text-black"
    />
    <input
      type="password"
      placeholder="New Password"
      value={passwords.newPassword}
      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
      className="w-full border border-gray-300 rounded px-3 py-2 text-black"
    />
    <input
      type="password"
      placeholder="Confirm New Password"
      value={passwords.confirmPassword}
      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
      className="w-full border border-gray-300 rounded px-3 py-2 text-black"
    />

    <button
      onClick={updatePassword}
      className="mt-4 bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700"
    >
      Update Password
    </button>
  </div>
)}

         
        </main>
      </div>
    </div>
  )
}
