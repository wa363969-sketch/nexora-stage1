import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
// Only working routes are listed; each stage adds its own.
const links = [{ to: '/admin', label: 'Overview', end: true }]
export default function AdminLayout() {
  const { user, logout } = useAuth(); const nav = useNavigate(); const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen md:flex bg-slate-50">
      <aside className={`${open ? 'block' : 'hidden'} md:block w-full md:w-60 bg-slate-900 text-slate-100 p-4 space-y-1`}>
        <div className="font-bold text-lg mb-4">Nexora</div>
        {links.map((l) => <NavLink key={l.to} {...l} onClick={() => setOpen(false)} className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>{l.label}</NavLink>)}
        <button onClick={async () => { await logout(); nav('/admin/login') }} className="mt-6 text-sm text-slate-400 underline">Sign out</button>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <button className="md:hidden border rounded px-3 py-1" onClick={() => setOpen(!open)}>Menu</button>
          <span className="text-sm text-slate-500 ml-auto">{user?.email}</span>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
