'use client'

import React, { useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import Card from './Card'
import ColumnMenu from './ColumnMenu'
import AddTaskModal from '@/components/Modals/AddTaskModal'

export default function Column({ column, tasks }: any) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const handleAddTask = (task: any) => {
    console.log('Task to be added:', task)
    setIsTaskModalOpen(false)
    // Optional: You can emit this back to BoardPage with a callback prop if needed
  }

  return (
    <div className="bg-white rounded-xl shadow-md w-64 p-4 flex-shrink-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{column.title}</h2>
        <ColumnMenu />
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

      {/* Add Task Button */}
      <button
        className="text-blue-600 text-sm mt-4 hover:underline"
        onClick={() => setIsTaskModalOpen(true)}
      >
        + Add task
      </button>

      {/* Modal */}
      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  )
}
