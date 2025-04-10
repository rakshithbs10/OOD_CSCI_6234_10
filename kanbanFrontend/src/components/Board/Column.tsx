'use client'

import React, { useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import Card from './Card'
import ColumnMenu from './ColumnMenu'
import AddTaskModal from '@/components/Modals/AddTaskModal'

export default function Column({ column, tasks, boardId }: { column: any, tasks: any[], boardId: string }) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [newTitle, setNewTitle] = useState(column.title)

  const handleAddTask = async (task: any) => {
    try {
      const res = await fetch(`http://localhost:5001/api/tasks/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...task,
          boardId: parseInt(boardId),
          columnId: parseInt(column.id)
        })
      })

      if (!res.ok) throw new Error('Failed to create task')
      window.location.reload()
    } catch (err) {
      console.error(err)
    }
    setIsTaskModalOpen(false)
  }

  const handleRename = () => setIsRenaming(true)

  const handleRenameSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/column/${column.id}/rename`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTitle })
      })
      if (res.ok) {
        setIsRenaming(false)
        window.location.reload()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/column/${column.id}`, {
        method: 'DELETE'
      })
      if (res.ok) window.location.reload()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md w-64 p-4 flex-shrink-0">
      <div className="flex justify-between items-center mb-4">
        {isRenaming ? (
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameSubmit()
              if (e.key === 'Escape') setIsRenaming(false)
            }}
            className="text-lg font-semibold text-gray-800 border-b border-gray-400 focus:outline-none"
            autoFocus
          />
        ) : (
          <h2 className="text-lg font-semibold text-gray-800">{column.title}</h2>
        )}
        <ColumnMenu onRename={handleRename} onDelete={handleDelete} />
      </div>

      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-3 min-h-[60px]"
          >
            {tasks.map((task: any, index: number) => (
              <Card key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button
        className="text-blue-600 text-sm mt-4 hover:underline"
        onClick={() => setIsTaskModalOpen(true)}
      >
        + Add task
      </button>

      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAdd={handleAddTask}
        boardId={parseInt(boardId)}
        columnId={parseInt(column.id)}
      />
    </div>
  )
}
