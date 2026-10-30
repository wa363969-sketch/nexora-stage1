import { useState, FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { account } from '../lib/appwrite'
export default function Reset() {
  const [q] = useSearchParams(); const nav = useNavigate()
  const [pw, setPw] = useState(''); const [msg, setMsg] = useState('')
  async function submit(e: FormEvent) {
    e.preventDefault()
    try { await account.updateRecovery(q.get('userId')!, q.get('secret')!, pw); nav('/admin/login') }
    catch { setMsg('Link invalid or expired.') }
  }
  return (
    <div className="min-h-screen grid place-items-center bg-slate-100 p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold">Set new password</h1>
        <input className="w-full border rounded px-3 py-2" type="password" minLength={12} required placeholder="New password (12+ chars)" value={pw} onChange={(e) => setPw(e.target.value)} />
        {msg && <p className="text-sm text-red-600">{msg}</p>}
        <button className="w-full bg-slate-900 text-white rounded py-2">Update password</button>
      </form>
    </div>
  )
}
