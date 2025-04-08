'use client'

import React, { useEffect, useState } from 'react'

export default function AddTaskModal({
  isOpen,
  onClose,
  onAdd,
  initialData = null
}: {
  isOpen: boolean
  onClose: () => void
  onAdd: (task: any) => void
  initialData?: any | null
}) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    createdBy: '',
    assignedTo: '',
    verifier: '',
    criteria: '',
    storyPoints: '',
    difficulty: '',
    attachments: null as File | null,
    verified: false,
    completed: false
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          ...form,
          ...initialData
        })
      } else {
        setForm({
          name: '',
          description: '',
          createdBy: '',
          assignedTo: '',
          verifier: '',
          criteria: '',
          storyPoints: '',
          difficulty: '',
          attachments: null,
          verified: false,
          completed: false
        })
      }
      setErrors({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData])

  const handleChange = (field: string, value: string | File | boolean | null) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = () => {
    const requiredFields = ['name', 'storyPoints', 'criteria', 'createdBy', 'difficulty']
    const newErrors: any = {}

    requiredFields.forEach((field) => {
      const value = form[field as keyof typeof form]
      if (value == null || (typeof value === 'string' && !value.trim())) {
        newErrors[field] = 'This field is required'
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onAdd(form)
    onClose()
  }

  if (!isOpen) return null


  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.35)] flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-3 right-4 text-xl font-bold text-gray-500">&times;</button>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Task</h2>

        {/* Task Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Task Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full border rounded px-3 py-2 text-black ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring`}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 resize-y text-black focus:outline-none focus:ring"
          />
        </div>

        {/* Created By, Assigned To, Verifier */}
        <div className="flex gap-4 mb-4">
          {['createdBy', 'assignedTo', 'verifier'].map((field) => (
            <div key={field} className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field.replace(/([A-Z])/g, ' $1')} {field === 'createdBy' ? '*' : ''}
              </label>
              <input
                type="text"
                value={form[field as keyof typeof form] as string}
                onChange={(e) => handleChange(field, e.target.value)}
                className={`w-full border rounded px-3 py-2 text-black ${
                  errors[field] ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring`}
              />
              {errors[field] && <p className="text-sm text-red-500 mt-1">{errors[field]}</p>}
            </div>
          ))}
        </div>

        {/* Acceptance Criteria */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Acceptance Criteria *</label>
          <textarea
            value={form.criteria}
            onChange={(e) => handleChange('criteria', e.target.value)}
            className={`w-full border rounded px-3 py-2 resize-y text-black ${
              errors.criteria ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring`}
          />
          {errors.criteria && <p className="text-sm text-red-500 mt-1">{errors.criteria}</p>}
        </div>

        {/* Story Points, Difficulty, Attachments */}
        <div className="flex gap-4 mb-4 items-start">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Story Points *</label>
            <input
              type="number"
              value={form.storyPoints}
              onChange={(e) => handleChange('storyPoints', e.target.value)}
              className={`w-full border rounded px-3 py-2 text-black ${
                errors.storyPoints ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring`}
            />
            {errors.storyPoints && <p className="text-sm text-red-500 mt-1">{errors.storyPoints}</p>}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Level of Difficulty (0–10) *</label>
            <input
              type="number"
              min="0"
              max="10"
              value={form.difficulty}
              onChange={(e) => handleChange('difficulty', e.target.value)}
              className={`w-full border rounded px-3 py-2 text-black ${
                errors.difficulty ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring`}
            />
            {errors.difficulty && <p className="text-sm text-red-500 mt-1">{errors.difficulty}</p>}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                onChange={(e) => handleChange('attachments', e.target.files?.[0] || null)}
                className="block w-full text-sm text-black border border-gray-300 rounded px-2 py-1 file:bg-blue-600 file:text-white file:rounded file:px-3 file:py-1"
              />
              {form.attachments && (
                <button
                  onClick={() => handleChange('attachments', null)}
                  className="text-red-500 font-bold"
                  title="Remove"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Verified & Completed */}
        <div className="flex gap-6 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.verified}
              onChange={(e) => handleChange('verified', e.target.checked)}
              className="accent-blue-600 w-4 h-4"
            />
            <span className="text-sm text-gray-700">Verified</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.completed}
              onChange={(e) => handleChange('completed', e.target.checked)}
              className="accent-green-600 w-4 h-4"
            />
            <span className="text-sm text-gray-700">Completed</span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>
    </div>
  )
}
