'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CreateAccountPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    position: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
    setErrors({ ...errors, [field]: '' })
    setErrorMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: any = {}

    Object.keys(form).forEach((field) => {
      if (!form[field as keyof typeof form].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const res = await fetch('http://localhost:5001/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Account creation failed')
      }

      const data = await res.json()
      sessionStorage.setItem('user', JSON.stringify(data))
      router.push('/login')
    } catch (error: any) {
      setErrorMessage(error.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="w-full h-16 bg-black text-white flex items-center px-6 shadow-md">
        <h1 className="text-xl font-bold tracking-wide">Kanban Task Board</h1>
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Account</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {['firstName', 'lastName', 'username', 'email', 'password', 'position'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === 'password' ? 'password' : 'text'}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className={`w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring ${
                    errors[field] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors[field] && <p className="text-sm text-red-500 mt-1">{errors[field]}</p>}
              </div>
            ))}

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Create Account
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
