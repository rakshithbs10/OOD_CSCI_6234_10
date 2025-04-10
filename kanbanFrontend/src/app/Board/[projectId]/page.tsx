'use client'

import { useParams } from 'next/navigation'
import BoardPage from '@/components/Board/BoardPage'

export default function ProjectBoardPage() {
  const { projectId } = useParams()

  return (
    <div className="min-h-screen">
      <BoardPage boardId={projectId?.toString()} />
    </div>
  )
}
