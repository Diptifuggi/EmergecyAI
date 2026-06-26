import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '@/api/authApi'
import { useMutation } from '@tanstack/react-query'
import loginBg from '@/assets/img1.jpg'
import { Lock, Mail, Shield, Headphones } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: ({ username, email, password }) => register(username, email, password),
  })

  const featureCards = [
    { title: '⚡ Faster Whisper STT', subtitle: 'Real-time speech transcription' },
    { title: '🔗 Smart Incident Correlation', subtitle: 'AI groups related emergency calls' },
    { title: '🧠 AI Severity Engine', subtitle: 'Predictive emergency prioritization' },
  ]

  const emergencyNumbers = [
    { label: '112', name: 'Emergency', tone: 'text-red-400', ring: 'bg-red-500/10' },
    { label: '100', name: 'Police', tone: 'text-sky-400', ring: 'bg-sky-500/10' },
    { label: '101', name: 'Fire', tone: 'text-orange-300', ring: 'bg-orange-500/10' },
    { label: '108', name: 'Ambulance', tone: 'text-emerald-400', ring: 'bg-emerald-500/10' },
    { label: '181', name: 'Women', tone: 'text-violet-400', ring: 'bg-violet-500/10' },
    { label: '1098', name: 'Child', tone: 'text-cyan-400', ring: 'bg-cyan-500/10' },
  ]

  function validateForm() {
    const newErrors = {}
    
    if (!form.username || form.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }
    
    if (!form.email || !form.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!form.password || form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function submit(e) {
    e.preventDefault()
    setErrors({})
    
    if (!validateForm()) {
      return
    }
    
    try {
      await mutation.mutateAsync({ 
        username: form.username, 
        email: form.email, 
        password: form.password 
      })
      // Show success message and redirect
      navigate('/login', { state: { message: 'Registration successful! Please login with your credentials.' } })
    } catch (e) {
      console.error('register error', e)
      const errorMsg = e?.response?.data?.detail || e?.message || 'Registration failed'
      setErrors({ submit: errorMsg })
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-[#090B12] text-white">
      <div
        className="relative w-full lg:w-[50%] overflow-hidden px-10 py-8"
        style={{
          backgroundImage: `linear-gradient(rgba(5,10,18,.82),rgba(5,10,18,.82)),url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(146,224,255,0.06),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(239,68,68,0.08),_transparent_25%)]" />
        <div className="absolute left-[-90px] top-[18%] h-[420px] w-[420px] rounded-full bg-[#111827] opacity-35 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-[200px] bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.12),_transparent_70%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between gap-10">
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-end gap-3 text-4xl font-bold leading-none">
                <span>Emergency</span>
                <span className="text-[#ef4444]">IQ</span>
              </div>
              <div className="text-base text-zinc-300">AI Powered Emergency Dispatch Platform</div>
            </div>

            <div className="grid gap-4">
              {featureCards.map((card) => (
                <div key={card.title} className="transform rounded-2xl border border-white/10 bg-white/4 px-4 py-3 transition duration-200 ease-out hover:-translate-y-1 hover:border-white/20">
                  <div className="text-sm font-semibold text-white">{card.title}</div>
                  <div className="mt-1 text-sm text-zinc-300">{card.subtitle}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="text-lg font-semibold">India Emergency Network</div>
              <div className="grid grid-cols-3 gap-3">
                {emergencyNumbers.map((item) => (
                  <div key={item.label} className={`group h-20 w-[110px] rounded-3xl border border-white/10 bg-white/5 p-3 transition duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] ${item.ring}`}>
                    <div className="text-2xl font-bold tracking-wide text-white">{item.label}</div>
                    <div className={`mt-2 text-sm font-semibold ${item.tone}`}>{item.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-3 text-sm text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span>Reliable</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span>AI Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span>Always Online</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-zinc-400">© 2026 EmergencyIQ</div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[50%] bg-[#F8FAFC] flex items-center justify-center px-8 py-10">
        <div className="w-full max-w-[460px] animate-fade-in" style={{ animation: 'fadeIn 0.9s ease-out forwards' }}>
          <div className="rounded-[20px] border border-black/10 bg-white/90 p-8 shadow-[0_24px_64px_rgba(15,23,42,0.08)] backdrop-blur-[24px]">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-18 w-18 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-red-200/10">
                <Headphones className="h-8 w-8 text-red-500" />
              </div>
              <div className="text-[36px] font-bold tracking-tight text-slate-900">Create account</div>
              <div className="text-base text-zinc-500">Emergency Dispatch Center</div>
              <div className="h-1.5 w-20 rounded-full bg-red-500" />
            </div>

            <form onSubmit={submit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-semibold text-slate-700">Username</label>
                <div className="rounded-[10px] border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-200">
                  <input
                    id="username"
                    aria-label="username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder="Username (min 3 characters)"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                  />
                </div>
                {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</label>
                <div className="relative rounded-[10px] border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-200">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    aria-label="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email"
                    type="email"
                    className="w-full bg-transparent pl-11 text-sm text-slate-900 outline-none"
                  />
                </div>
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
                <div className="relative rounded-[10px] border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-200">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    aria-label="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Password (min 8 characters)"
                    type="password"
                    className="w-full bg-transparent pl-11 text-sm text-slate-900 outline-none"
                  />
                </div>
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">Confirm Password</label>
                <div className="relative rounded-[10px] border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-200">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="confirmPassword"
                    aria-label="confirmPassword"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    type="password"
                    className="w-full bg-transparent pl-11 text-sm text-slate-900 outline-none"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full rounded-[10px] bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-5 py-3 text-base font-semibold text-white shadow-[0_18px_36px_rgba(220,38,38,0.18)] transition duration-200 ease-out hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {mutation.isPending ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            {errors.submit && <div className="text-red-600 mt-4 p-3 bg-red-50 rounded">{errors.submit}</div>}

            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account? <button onClick={() => navigate('/login')} className="font-semibold text-sky-600 hover:text-sky-700">Sign in</button>
            </div>
          </div>

          <div className="mt-6 rounded-[20px] border border-slate-200/70 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <Shield className="h-5 w-5 text-emerald-500" />
              Emergency numbers available for instant dispatch
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-slate-600">
              <span className="rounded-2xl bg-slate-100 px-3 py-2 text-center font-semibold">112</span>
              <span className="rounded-2xl bg-slate-100 px-3 py-2 text-center font-semibold">100</span>
              <span className="rounded-2xl bg-slate-100 px-3 py-2 text-center font-semibold">101</span>
              <span className="rounded-2xl bg-slate-100 px-3 py-2 text-center font-semibold">108</span>
              <span className="rounded-2xl bg-slate-100 px-3 py-2 text-center font-semibold">181</span>
              <span className="rounded-2xl bg-slate-100 px-3 py-2 text-center font-semibold">1098</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
