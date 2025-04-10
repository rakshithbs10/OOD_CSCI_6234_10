'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })
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
    if (!form.email.trim()) newErrors.email = 'Email is required'
    if (!form.password.trim()) newErrors.password = 'Password is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const res = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Login failed')
      }

      const data = await res.json()
      sessionStorage.setItem('token', data.token)
      sessionStorage.setItem('user', JSON.stringify(data.user))
      sessionStorage.setItem('username', data.user.username)

      router.push('/') // change if your main page is different
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600 text-center">
            Don&apos;t have an account?{' '}
            <Link href="/create-account" className="text-blue-600 hover:underline">
              Create a new account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
