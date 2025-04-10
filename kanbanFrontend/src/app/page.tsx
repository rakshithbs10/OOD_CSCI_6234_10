'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar/Sidebar'
import Header from '@/components/Header/Header'
import CreateBoardModal from '@/components/Modals/CreateBoardModal'
import CreateTeamModal from '@/components/Modals/CreateTeamModal'

export default function HomePage() {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    const user = sessionStorage.getItem('user')
    if (!token || !user) {
      window.location.href = '/login'
      return
    }

    const userId = JSON.parse(user).id

    const fetchBoards = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/boards/user/${userId}/boards`)
        const data = await res.json()
        setProjects(data)
      } catch (err) {
        console.error('Failed to fetch projects', err)
        setProjects([])
      }
    }

    fetchBoards()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-8 space-y-12">
          {/* Projects Grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
              <button
                onClick={() => setIsBoardModalOpen(true)}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
              >
                <span className="text-lg mr-1">＋</span> New Project
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(projects) && projects.length > 0 ? (
                projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/Board/${project.id}`}
                    className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.01] transition-transform p-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-600">Owner: {project.owner?.username || 'Unknown'}</p>
                  </Link>
                ))
              ) : (
                <p className="text-gray-600">You have not been added to any project yet.</p>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Modals */}
      <CreateBoardModal isOpen={isBoardModalOpen} onClose={() => setIsBoardModalOpen(false)} />
      <CreateTeamModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} />
    </div>
  )
}
