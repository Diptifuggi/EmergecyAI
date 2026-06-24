import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axiosClient from '@/api/axiosClient'
import { LayoutDashboard, Phone, MapPin, BarChart2, Users, Shield, ScrollText, Settings } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

function HealthDot({ healthy }){
  // pulsing when healthy, static red when not
  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full ${healthy ? 'bg-emerald-400 animate-pulse' : 'bg-red-600'}`} />
  )
}

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/calls', label: 'Live Calls', Icon: Phone },
  { to: '/incidents', label: 'Incidents', Icon: MapPin },
  { to: '/analytics', label: 'Analytics', Icon: BarChart2 },
]

const ADMIN_ITEMS = [
  { to: '/admin/users', label: 'User Management', Icon: Users },
  { to: '/admin/roles', label: 'Roles', Icon: Shield },
  { to: '/admin/audit', label: 'Audit Logs', Icon: ScrollText },
  { to: '/settings', label: 'Settings', Icon: Settings },
]

export default function Sidebar(){
  const navigate = useNavigate()
  const { user, logout } = useAuth()

    const { data: healthy, isLoading } = useQuery({
      queryKey: ['system','health'],
      queryFn: async () => {
        const res = await axiosClient.get('/health')
        return res.status === 200
      },
      refetchInterval: 30000,
      retry: false,
      initialData: false
    })

  function handleLogout(){
    logout()
    navigate('/login')
  }

  const initials = (user?.full_name || 'OP').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()

  // collapsed state persisted
  const [collapsed, setCollapsed] = React.useState(() => {
    try { return localStorage.getItem('sidebar:collapsed') === 'true' } catch { return false }
  })
  const [mobileOpen, setMobileOpen] = React.useState(false)

  React.useEffect(()=>{
    function onResize(){ if (window.innerWidth < 1280) setCollapsed(true) }
    function onToggle(){ setMobileOpen(s => !s) }
    window.addEventListener('resize', onResize)
    window.addEventListener('toggleMobileSidebar', onToggle)
    onResize()
    return ()=>{ window.removeEventListener('resize', onResize); window.removeEventListener('toggleMobileSidebar', onToggle) }
  }, [])

  React.useEffect(()=>{ try { localStorage.setItem('sidebar:collapsed', collapsed ? 'true' : 'false') } catch {} }, [collapsed])

  const widthStyle = collapsed ? 48 : 240

  const content = (
    <div className={`flex flex-col bg-[#111111] text-white ${collapsed ? 'text-center' : ''}`} style={{width:widthStyle, minWidth:widthStyle, borderRight: '1px solid #222222'}}>
      <div className="h-14 flex items-center px-4 border-b border-white/5">
        <div>
          <div className="text-white font-bold">EmergencyIQ</div>
          {!collapsed && <div className="text-sm text-white/60">Dispatch Platform</div>}
        </div>
      </div>

      <div className="px-4 py-3 flex items-center gap-3 border-b border-white/5">
        <HealthDot healthy={healthy} />
        {!collapsed && <div className="text-xs">
          <div className="text-[10px] text-white/60">SYSTEM</div>
          <div className={`text-[11px] ${healthy ? 'text-emerald-300' : 'text-red-400'}`}>SYSTEM LIVE</div>
        </div>}
      </div>

      <nav className="flex-1 px-2 py-3 overflow-auto">
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} className={({isActive}) =>
            `flex items-center h-10 px-3 my-1 rounded-md ${isActive ? 'text-white border-l-2 border-white pl-2 bg-white/5' : 'text-white/80 hover:bg-white/5'}`
          }>
            <item.Icon className="w-5 h-5 mr-3" title={item.label} />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}

        <div className="my-3 border-t border-white/5" />

        {user?.role_name === 'Admin' && ADMIN_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} className={({isActive}) =>
            `flex items-center h-10 px-3 my-1 rounded-md ${isActive ? 'text-white border-l-2 border-white pl-2 bg-white/5' : 'text-white/80 hover:bg-white/5'}`
          }>
            <item.Icon className="w-5 h-5 mr-3" title={item.label} />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">{initials}</div>
        {!collapsed && <div className="flex-1">
          <div className="text-sm">{user?.full_name || 'Operator'}</div>
          <div className="text-xs text-white/60">{user?.role_name || 'Operator'}</div>
        </div>}
        <div className="flex gap-2">
          <button onClick={()=> setCollapsed(c=>!c)} className="text-sm text-white/60">{collapsed ? '→' : '←'}</button>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Log Out</button>
        </div>
      </div>
    </div>
  )

  if (mobileOpen) {
    return (
      <>
        <div className="fixed inset-0 z-40 bg-black/40" onClick={()=>setMobileOpen(false)} />
        <div className="fixed left-0 top-0 z-50 h-full">{content}</div>
      </>
    )
  }

  return content
}
