'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar/Sidebar'
import Header from '@/components/Header/Header'
import CreateBoardModal from '@/components/Modals/CreateBoardModal'
import CreateTeamModal from '@/components/Modals/CreateTeamModal'

const projects = [
  { id: 1, name: 'Apollo', owner: 'Laura Adams' },
  { id: 2, name: 'Beacon', owner: 'Steve Jobs' },
  { id: 3, name: 'Catalyst', owner: 'Olivia Pace' },
  { id: 4, name: 'Delta', owner: 'Quincy Adams' },
  { id: 5, name: 'Echo', owner: 'Ursula Monroe' }
]

const teams = [
  { id: 1, name: 'Quantum Innovations', productOwner: 'LauraAdams', projectManager: 'BobSmith' },
  { id: 2, name: 'Nebula Research', productOwner: 'OliviaPace', projectManager: 'DaveBrown' },
  { id: 3, name: 'Orion Solutions', productOwner: 'QuincyAdams', projectManager: 'FrankWright' },
  { id: 4, name: 'Krypton Developments', productOwner: 'SteveJobs', projectManager: 'HenryAllen' },
  { id: 5, name: 'Zenith Technologies', productOwner: 'UrsulaMonroe', projectManager: 'JohnDoe' }
]

export default function HomePage() {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)

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
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/Board/${project.id}`}
                  className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.01] transition-transform p-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                  <p className="text-sm text-gray-600">Owner: {project.owner}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Teams Grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Teams</h2>
              <button
                onClick={() => setIsTeamModalOpen(true)}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
              >
                <span className="text-lg mr-1">＋</span> New Team
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Link
                  key={team.id}
                  href={`/teams/${team.id}`}
                  className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.01] transition-transform p-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{team.name}</h3>
                  <p className="text-sm text-gray-600">Product Owner: {team.productOwner}</p>
                  <p className="text-sm text-gray-600">Project Manager: {team.projectManager}</p>
                </Link>
              ))}
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
