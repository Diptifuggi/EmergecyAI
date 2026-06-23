import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage(){
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSignIn(){
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (e) {
      setError(e?.response?.data?.detail || 'Invalid credentials')
    } finally { setLoading(false) }
  }

  const chips = ['Faster Whisper STT','pgvector Correlation','AI Severity Engine']
  const emergencyNumbers = ['112','100','101','108','181','1098']

  return (
    <div className="min-h-screen flex">
      <div className="w-[55%] bg-[#0a0a0a] text-white flex flex-col justify-center px-16">
        <div>
          <div className="text-4xl font-medium">EmergencyIQ</div>
          <div className="mt-2 text-gray-400">AI-Powered Emergency Dispatch Platform</div>
        </div>

        <div className="mt-10">
          <div className="flex gap-3">
            {chips.map(c => (
              <div key={c} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm">{c}</div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="text-sm text-white/80">India Emergency Network</div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {emergencyNumbers.map(n => <div key={n} className="px-2 py-1 rounded-full bg-white/10 text-white text-xs">{n}</div>)}
          </div>
        </div>

        <div className="mt-auto text-xs text-gray-500">Powered by FastAPI · PostgreSQL · React</div>
      </div>

      <div className="w-[45%] bg-white flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-2xl font-semibold">Operator Login</div>
          <div className="text-sm text-gray-500">Emergency Dispatch Center</div>
          <div className="h-px bg-gray-100 my-4" />

          <div className="space-y-3">
            <div>
              <label className="text-sm block mb-1">Email address</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="you@agency.example" />
            </div>

            <div>
              <label className="text-sm block mb-1">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} className="w-full border px-3 py-2 rounded pr-10" placeholder="••••••••" />
                <button onClick={()=>setShow(s=>!s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
            </div>

            <div>
              <button onClick={handleSignIn} disabled={loading} className="w-full bg-black text-white py-2 rounded flex items-center justify-center">
                {loading ? <><Loader2 className="animate-spin mr-2" /> Authenticating...</> : 'Sign In'}
              </button>
            </div>

            <div className="text-sm text-center">
              Don't have an account? <button onClick={()=>navigate('/signup')} className="text-blue-600">Sign up</button>
            </div>

            <div className="h-px bg-gray-100 my-3" />
            <div className="text-sm text-gray-500">For emergencies: 112 · 100 · 101 · 108</div>
          </div>
        </div>
      </div>
    </div>
  )
}
