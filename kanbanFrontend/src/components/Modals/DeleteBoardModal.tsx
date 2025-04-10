'use client'

export default function DeleteBoardModal({
  isOpen,
  onClose,
  boardId
}: {
  isOpen: boolean
  onClose: () => void
  boardId: number
}) {
  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/boards/${boardId}/delete`, {
        method: 'PUT'
      })

      if (res.ok) {
        window.location.href = '/' // Redirect to homepage or project list
      } else {
        console.error('Failed to delete board')
      }
    } catch (err) {
      console.error('Error deleting board:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.35)] flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm relative">
        <button className="absolute right-4 top-3 text-xl font-bold text-gray-600" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4 text-gray-800">Delete Board</h2>
        <p className="text-gray-700 mb-6">Are you sure you want to delete this board?</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 rounded border border-gray-300 text-black hover:bg-gray-100">
            Cancel
          </button>
          <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
