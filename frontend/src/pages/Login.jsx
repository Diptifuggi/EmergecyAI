import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/api/authApi'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const navigate = useNavigate()
  const mutation = useMutation({ mutationFn: login, onSuccess: () => navigate('/') })

  function submit(e){
    e.preventDefault()
    mutation.mutate(form)
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <input aria-label="username" value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})} placeholder="Username" className="w-full border p-2 rounded" />
        <input aria-label="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} placeholder="Password" type="password" className="w-full border p-2 rounded" />
        <button type="submit" className="px-4 py-2 bg-black text-white rounded">Sign in</button>
      </form>
    </div>
  )
}
