'use client'

import { useEffect, useState } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { v4 as uuidv4 } from 'uuid'
import Column from './Column'
import Sidebar from '@/components/Sidebar/Sidebar'
import Header from '@/components/Header/Header'
import AddColumnModal from '@/components/Modals/AddColumnModal'
import AddMemberModal from '@/components/Modals/AddMemberModal'
import RemoveMemberModal from '@/components/Modals/RemoveMemberModal'
import DeleteBoardModal from '@/components/Modals/DeleteBoardModal'

interface Task {
  id: string
  title: string
  description: string
  createdBy: string
  assignedTo: string
  verifier: string
  acceptanceCriteria: string
  storyPoints: string
  difficulty: string
  attachments: File | null
  verified: boolean
  completed: boolean
  columnId: string
}

interface ColumnType {
  id: string
  title: string
  taskIds: string[]
}

interface BoardData {
  tasks: Record<string, Task>
  columns: Record<string, ColumnType>
  columnOrder: string[]
  ownerId: number
}

export default function BoardPage({ boardId }: { boardId?: string }) {
  const [data, setData] = useState<BoardData | null>(null)
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const user = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user') || '{}') : {}

  const fetchBoard = async () => {
    if (!boardId) return

    try {
      const res = await fetch(`http://localhost:5001/api/boards/board/${boardId}`)
      const board = await res.json()

      const tasks: Record<string, Task> = {}
      const columns: Record<string, ColumnType> = {}
      const columnOrder: string[] = []

      for (const col of board.columns || []) {
        const taskIds: string[] = []

        for (const task of col.tasks || []) {
          tasks[task.id] = {
            id: String(task.id),
            title: task.title,
            description: task.description,
            createdBy: task.createdBy,
            assignedTo: task.assignedTo,
            verifier: task.verifier,
            acceptanceCriteria: task.acceptanceCriteria,
            storyPoints: String(task.storyPoints),
            difficulty: String(task.difficulty),
            attachments: task.attachment || null,
            verified: task.verified,
            completed: task.completed,
            columnId: String(task.columnId)
          }
          taskIds.push(String(task.id))
        }

        columns[col.id] = {
          id: String(col.id),
          title: col.name,
          taskIds
        }

        columnOrder.push(String(col.id))
      }

      setData({ tasks, columns, columnOrder, ownerId: board.ownerId })
    } catch (err) {
      console.error('Failed to load board:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBoard()
  }, [boardId])

  const onDragEnd = async (result: DropResult) => {
    if (!data) return
    const { source, destination, draggableId } = result
    if (!destination || source.droppableId === destination.droppableId) return

    const taskId = parseInt(draggableId)
    const targetColumnId = parseInt(destination.droppableId)

    try {
      await fetch(`http://localhost:5001/api/tasks/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, targetColumnId })
      })
      await fetchBoard()
    } catch (error) {
      console.error('Failed to move task:', error)
    }
  }

  const handleAddColumn = async (title: string) => {
    try {
      const res = await fetch('http://localhost:5001/api/boards/column/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId: parseInt(boardId!), name: title })
      })

      if (!res.ok) throw new Error('Failed to create column')
      await fetchBoard()
    } catch (err) {
      console.error(err)
    } finally {
      setIsColumnModalOpen(false)
    }
  }

  const isOwner = data && user?.id === data.ownerId

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="flex">
        <Sidebar />
        <main className="p-6 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Project Board</h1>
            {isOwner && (
              <div className="flex gap-3">
                <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition" onClick={() => setShowAddMemberModal(true)}>
                  Add Member
                </button>
                <button className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition" onClick={() => setShowRemoveMemberModal(true)}>
                  Remove Member
                </button>
                <button className="bg-red-600 text-white px-3 py-1 rounded over:bg-red-700 transition" onClick={() => setShowDeleteModal(true)}>
                  Delete Board
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <p className="text-gray-600">Loading board...</p>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {data && data.columnOrder.length > 0 ? (
                  data.columnOrder.map((columnId) => {
                    const column = data.columns[columnId]
                    const tasks = column.taskIds.map((taskId) => data.tasks[taskId])
                    return (
                      <Column
                        key={column.id}
                        column={column}
                        tasks={tasks}
                        boardId={boardId!}
                      />
                    )
                  })
                ) : (
                  <p className="text-gray-600">No columns yet.</p>
                )}

                <button
                  onClick={() => setIsColumnModalOpen(true)}
                  className="min-w-[250px] h-[200px] bg-white border-2 border-dashed border-gray-300 flex items-center justify-center rounded-xl text-gray-500 hover:border-gray-400 hover:bg-gray-100"
                >
                  + Add Column
                </button>
              </div>
            </DragDropContext>
          )}
        </main>
      </div>

      <AddColumnModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        onAdd={handleAddColumn}
      />

      {/* Modals */}
      <AddMemberModal boardId={parseInt(boardId!)} isOpen={showAddMemberModal} onClose={() => setShowAddMemberModal(false)} />
      <RemoveMemberModal boardId={parseInt(boardId!)} isOpen={showRemoveMemberModal} onClose={() => setShowRemoveMemberModal(false)} />
      <DeleteBoardModal boardId={parseInt(boardId!)} isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
    </div>
  )
}
