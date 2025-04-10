'use client'

import { useEffect, useState } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { v4 as uuidv4 } from 'uuid'
import Column from './Column'
import Sidebar from '@/components/Sidebar/Sidebar'
import Header from '@/components/Header/Header'
import AddColumnModal from '@/components/Modals/AddColumnModal'

interface Task {
  id: string
  name: string
  description: string
  createdBy: string
  assignedTo: string
  verifier: string
  criteria: string
  storyPoints: string
  difficulty: string
  attachments: File | null
  verified: boolean
  completed: boolean
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
}

export default function BoardPage({ boardId }: { boardId?: string }) {
  const [data, setData] = useState<BoardData | null>(null)
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchBoard = async () => {
    if (!boardId) return

    try {
      const res = await fetch(`http://localhost:5001/api/boards/board/${boardId}`)
      const board = await res.json()

      const columns: Record<string, ColumnType> = {}
      const columnOrder: string[] = []

      for (const col of board.columns || []) {
        columns[col.id] = {
          id: col.id.toString(),
          title: col.name,
          taskIds: [] // Future task integration
        }
        columnOrder.push(col.id.toString())
      }

      const transformed: BoardData = {
        tasks: {},
        columns,
        columnOrder
      }

      setData(transformed)
    } catch (err) {
      console.error('Failed to load board:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBoard()
  }, [boardId])

  const onDragEnd = (result: DropResult) => {
    if (!data) return
    const { source, destination, draggableId } = result
    if (!destination) return

    const start = data.columns[source.droppableId]
    const end = data.columns[destination.droppableId]

    if (start === end) {
      const newTaskIds = [...start.taskIds]
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)
      const newColumn = { ...start, taskIds: newTaskIds }

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn
        }
      })
    } else {
      const startTaskIds = [...start.taskIds]
      const endTaskIds = [...end.taskIds]
      startTaskIds.splice(source.index, 1)
      endTaskIds.splice(destination.index, 0, draggableId)

      setData({
        ...data,
        columns: {
          ...data.columns,
          [start.id]: { ...start, taskIds: startTaskIds },
          [end.id]: { ...end, taskIds: endTaskIds }
        }
      })
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

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="flex">
        <Sidebar />
        <main className="p-6 flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Project Board</h1>

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
    </div>
  )
}
