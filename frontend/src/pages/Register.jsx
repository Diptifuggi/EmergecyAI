import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '@/api/authApi'
import { useMutation } from '@tanstack/react-query'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: ({name,email,password}) => register(name,email,password),
  })

  async function submit(e){
    e.preventDefault()
    setError(null)
    if (form.password !== form.confirm) return setError('Passwords do not match')
    try {
      await mutation.mutateAsync({ name: form.name, email: form.email, password: form.password })
      navigate('/login')
    } catch (e) {
      console.error('register error', e)
      const status = e?.response?.status
      if (status === 404) {
        setError('Registration endpoint not available on the backend. Please contact your administrator or sign in with an existing account.')
      } else {
        setError(e?.response?.data?.detail || e?.message || 'Registration failed')
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Create an account</h1>
      <form onSubmit={submit} className="space-y-3">
        <input aria-label="name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} placeholder="Full name" className="w-full border p-2 rounded" />
        <input aria-label="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} placeholder="Email" className="w-full border p-2 rounded" />
        <input aria-label="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} placeholder="Password" type="password" className="w-full border p-2 rounded" />
        <input aria-label="confirm" value={form.confirm} onChange={(e)=>setForm({...form, confirm:e.target.value})} placeholder="Confirm password" type="password" className="w-full border p-2 rounded" />
        <button type="submit" disabled={mutation.isLoading} className="px-4 py-2 bg-black text-white rounded">
          {mutation.isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      <div className="text-sm text-gray-600 mt-3">Already have an account? <button onClick={()=>navigate('/login')} className="text-blue-600">Sign in</button></div>
    </div>
  )
}
