'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FaHome, FaClock, FaSearch, FaCog, FaUsers, FaUserFriends,
  FaBoxOpen, FaExclamationCircle, FaExclamationTriangle,
  FaAngleDown, FaAngleUp, FaLayerGroup, FaPlay, FaVolumeUp
} from 'react-icons/fa'

const priorities = [
  { label: 'Urgent', icon: <FaExclamationCircle /> },
  { label: 'High', icon: <FaExclamationTriangle /> },
  { label: 'Medium', icon: <FaLayerGroup /> },
  { label: 'Low', icon: <FaAngleDown /> },
  { label: 'Backlog', icon: <FaBoxOpen /> },
]

export default function Sidebar() {
  const [showProjects, setShowProjects] = useState(true)
  const [showPriorities, setShowPriorities] = useState(true)
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    const user = sessionStorage.getItem('user')
    if (!user) return

    const userId = JSON.parse(user).id

    const fetchBoards = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/boards/user/${userId}/boards`)
        const data = await res.json()
        setProjects(data)
      } catch (error) {
        console.error('Failed to fetch sidebar projects:', error)
      }
    }

    fetchBoards()
  }, [])

  return (
    <aside className="bg-black text-white w-64 h-screen flex flex-col justify-between p-4 shadow-xl">
      <div>
        <nav className="space-y-2">
          <SidebarItem icon={<FaHome />} label="Home" href="/" />
          <SidebarItem icon={<FaClock />} label="Timeline" href="/timeline" />
          <SidebarItem icon={<FaSearch />} label="Search" href="/search" />
          <SidebarItem icon={<FaCog />} label="Settings" href="/settings" />
        </nav>

        {/* Projects */}
        <SectionToggle title="Projects" open={showProjects} onToggle={() => setShowProjects(!showProjects)} />
        {showProjects && (
          <div className="pl-4 space-y-2 mt-2">
            {projects.map((project) => (
              <SidebarItem
                key={project.id}
                icon={<FaBoxOpen />}
                label={project.name}
                href={`/Board/${project.id}`}
              />
            ))}
          </div>
        )}

        {/* Priority */}
        <SectionToggle title="Priority" open={showPriorities} onToggle={() => setShowPriorities(!showPriorities)} />
        {showPriorities && (
          <div className="pl-4 space-y-2 mt-2">
            {priorities.map((p) => (
              <SidebarItem
                key={p.label}
                icon={p.icon}
                label={p.label}
                href={`/priority/${p.label.toLowerCase()}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between px-4 pt-4 border-t border-gray-700">
        <FaPlay className="text-sm" />
        <FaVolumeUp className="text-sm" />
      </div>
    </aside>
  )
}

function SidebarItem({
  icon,
  label,
  href
}: {
  icon: React.ReactNode
  label: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 cursor-pointer px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-gray-300"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </Link>
  )
}

function SectionToggle({
  title,
  open,
  onToggle
}: {
  title: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 mt-4 text-gray-400 cursor-pointer hover:text-white transition-colors"
      onClick={onToggle}
    >
      <span className="uppercase text-xs font-semibold tracking-wide">{title}</span>
      {open ? <FaAngleUp /> : <FaAngleDown />}
    </div>
  )
}
