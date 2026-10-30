import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
export default function Login() {
  const { login, recover } = useAuth(); const nav = useNavigate()
  const [email, setEmail] = useState(''); const [pw, setPw] = useState('')
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMsg('')
    try { await login(email, pw); nav('/admin') }
    catch { setMsg('Invalid credentials.') } finally { setBusy(false) }
  }
  async function forgot() {
    if (!email) return setMsg('Enter your email first.')
    try { await recover(email); setMsg('If the account exists, a reset link was sent.') } catch { setMsg('Could not send reset email.') }
  }
  return (
    <div className="min-h-screen grid place-items-center bg-slate-100 p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold">Nexora Admin</h1>
        <input className="w-full border rounded px-3 py-2" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="password" required placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
        {msg && <p className="text-sm text-red-600">{msg}</p>}
        <button disabled={busy} className="w-full bg-slate-900 text-white rounded py-2 disabled:opacity-50">{busy ? 'Signing in…' : 'Sign in'}</button>
        <button type="button" onClick={forgot} className="text-sm text-slate-600 underline">Forgot password?</button>
      </form>
    </div>
  )
}
