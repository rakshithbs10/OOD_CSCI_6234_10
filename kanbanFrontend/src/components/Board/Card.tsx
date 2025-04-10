'use client'

import { Draggable } from '@hello-pangea/dnd'
import { useState } from 'react'
import AddTaskModal from '@/components/Modals/AddTaskModal'

export default function Card({ task, index, boardId, columnId }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    id,
    title,
    createdBy,
    assignedTo,
    verifier,
    storyPoints,
    verified,
    completed,
    description,
    acceptanceCriteria,
    difficulty,
    attachment
  } = task

  return (
    <>
      <Draggable draggableId={id.toString()} index={index}>
        {(provided) => (
          <div
            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-800 text-base">{title}</h3>
              {storyPoints && (
                <div className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  {storyPoints}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-700 space-y-1 mb-3">
              {createdBy && <p><strong>Created by:</strong> {createdBy}</p>}
              {assignedTo && <p><strong>Assigned to:</strong> {assignedTo}</p>}
              {verifier && <p><strong>Verifier:</strong> {verifier}</p>}
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1 text-sm text-gray-600">
                <input type="checkbox" checked={verified} disabled className="accent-blue-600" />
                Verified
              </label>
              <label className="flex items-center gap-1 text-sm text-gray-600">
                <input type="checkbox" checked={completed} disabled className="accent-green-600" />
                Completed
              </label>
            </div>
          </div>
        )}
      </Draggable>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={() => {}}
        boardId={boardId}
        columnId={columnId}
        taskId={id}
        initialData={{
          name: title,
          createdBy,
          assignedTo,
          verifier,
          storyPoints,
          verified,
          completed,
          description: description || '',
          criteria: acceptanceCriteria || '',
          difficulty: difficulty || '',
          attachments: attachment || null
        }}
      />
    </>
  )
}
