import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
export default function Guard({ children }: { children: JSX.Element }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <div className="p-8 text-slate-500">Loading…</div>
  return user && isAdmin ? children : <Navigate to="/admin/login" replace />
}
