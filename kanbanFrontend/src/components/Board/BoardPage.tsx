'use client'

import { useState } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { v4 as uuidv4 } from 'uuid'
import Column from './Column'
import Sidebar from '@/components/Sidebar/Sidebar'
import Header from '@/components/Header/Header'
import AddColumnModal from '@/components/Modals/AddColumnModal'
import AddTaskModal from '@/components/Modals/AddTaskModal'

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

const initialData: BoardData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      name: 'Task 1 Title',
      description: 'Detailed description for task 1.',
      createdBy: 'Diana',
      assignedTo: 'Diana',
      verifier: 'Frank',
      criteria: 'Acceptance criteria for task 1.',
      storyPoints: '9',
      difficulty: '1',
      attachments: null,
      verified: false,
      completed: false
    },
    'task-2': {
      id: 'task-2',
      name: 'Task 2 Title',
      description: 'Detailed description for task 2.',
      createdBy: 'Diana',
      assignedTo: 'Frank',
      verifier: 'Diana',
      criteria: 'Acceptance criteria for task 2.',
      storyPoints: '8',
      difficulty: '2',
      attachments: null,
      verified: true,
      completed: false
    },
    'task-3': {
      id: 'task-3',
      name: 'Task 3 Title',
      description: 'Detailed description for task 3.',
      createdBy: 'Charlie',
      assignedTo: 'Eve',
      verifier: 'Charlie',
      criteria: 'Acceptance criteria for task 3.',
      storyPoints: '1',
      difficulty: '2',
      attachments: null,
      verified: true,
      completed: false
    },
    'task-4': {
      id: 'task-4',
      name: 'Task 4 Title',
      description: 'Detailed description for task 4.',
      createdBy: 'Diana',
      assignedTo: 'Charlie',
      verifier: 'Alice',
      criteria: 'Acceptance criteria for task 4.',
      storyPoints: '3',
      difficulty: '5',
      attachments: null,
      verified: true,
      completed: false
    },
    'task-5': {
      id: 'task-5',
      name: 'Task 5 Title',
      description: 'Detailed description for task 5.',
      createdBy: 'Bob',
      assignedTo: 'Bob',
      verifier: 'Eve',
      criteria: 'Acceptance criteria for task 5.',
      storyPoints: '7',
      difficulty: '4',
      attachments: null,
      verified: false,
      completed: true
    },
    'task-6': {
      id: 'task-6',
      name: 'Task 6 Title',
      description: 'Detailed description for task 6.',
      createdBy: 'Diana',
      assignedTo: 'Diana',
      verifier: 'Alice',
      criteria: 'Acceptance criteria for task 6.',
      storyPoints: '9',
      difficulty: '8',
      attachments: null,
      verified: true,
      completed: true
    },
    'task-7': {
      id: 'task-7',
      name: 'Task 7 Title',
      description: 'Detailed description for task 7.',
      createdBy: 'Diana',
      assignedTo: 'Eve',
      verifier: 'Frank',
      criteria: 'Acceptance criteria for task 7.',
      storyPoints: '3',
      difficulty: '8',
      attachments: null,
      verified: true,
      completed: false
    },
    'task-8': {
      id: 'task-8',
      name: 'Task 8 Title',
      description: 'Detailed description for task 8.',
      createdBy: 'Diana',
      assignedTo: 'Bob',
      verifier: 'Diana',
      criteria: 'Acceptance criteria for task 8.',
      storyPoints: '3',
      difficulty: '2',
      attachments: null,
      verified: true,
      completed: false
    },
    'task-9': {
      id: 'task-9',
      name: 'Task 9 Title',
      description: 'Detailed description for task 9.',
      createdBy: 'Alice',
      assignedTo: 'Eve',
      verifier: 'Bob',
      criteria: 'Acceptance criteria for task 9.',
      storyPoints: '1',
      difficulty: '7',
      attachments: null,
      verified: true,
      completed: false
    }
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2', 'task-3']
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-4', 'task-5', 'task-6']
    },
    'column-3': {
      id: 'column-3',
      title: 'Review',
      taskIds: ['task-7', 'task-8', 'task-9']
    }
  },
  columnOrder: ['column-1', 'column-2', 'column-3']
}

export default function BoardPage() {
  const [data, setData] = useState<BoardData>(initialData)
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const onDragEnd = (result: DropResult) => {
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

  const handleAddColumn = (title: string) => {
    const id = uuidv4()
    const newColumn: ColumnType = {
      id,
      title,
      taskIds: []
    }

    setData({
      ...data,
      columns: {
        ...data.columns,
        [id]: newColumn
      },
      columnOrder: [...data.columnOrder, id]
    })
    setIsColumnModalOpen(false)
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Header always on top */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="flex">
        <Sidebar />

        <main className="p-6 flex-1">
          {/* Static board title for now. This should come from backend based on projectId */}
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Project Board</h1>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {data.columnOrder.map((columnId) => {
                const column = data.columns[columnId]
                const tasks = column.taskIds.map((taskId) => data.tasks[taskId])
                return <Column key={column.id} column={column} tasks={tasks} />
              })}

              <button
                onClick={() => setIsColumnModalOpen(true)}
                className="min-w-[250px] h-[200px] bg-white border-2 border-dashed border-gray-300 flex items-center justify-center rounded-xl text-gray-500 hover:border-gray-400 hover:bg-gray-100"
              >
                + Add Column
              </button>
            </div>
          </DragDropContext>
        </main>
      </div>

      {/* Modals */}
      <AddColumnModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        onAdd={handleAddColumn}
      />
      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAdd={(taskData) => console.log(taskData)} // Replace with state logic if needed
      />
    </div>
  )
}
