import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { account } from '../lib/appwrite'
import type { Models } from 'appwrite'
// Labels only decide which UI to show. Real enforcement = Appwrite permissions on
// label:owner / label:staff, which the browser cannot change.
type Ctx = { user: Models.User<Models.Preferences> | null; loading: boolean; isAdmin: boolean
  login: (e: string, p: string) => Promise<void>; logout: () => Promise<void>; recover: (e: string) => Promise<void> }
const AuthCtx = createContext<Ctx>(null!)
export const useAuth = () => useContext(AuthCtx)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Ctx['user']>(null); const [loading, setLoading] = useState(true)
  useEffect(() => { account.get().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false)) }, [])
  const login = async (e: string, p: string) => { await account.createEmailPasswordSession(e, p); setUser(await account.get()) }
  const logout = async () => { await account.deleteSession('current'); setUser(null) }
  const recover = async (e: string) => { await account.createRecovery(e, `${location.origin}/admin/reset`) }
  const isAdmin = !!user?.labels?.some((l) => l === 'owner' || l === 'staff')
  return <AuthCtx.Provider value={{ user, loading, isAdmin, login, logout, recover }}>{children}</AuthCtx.Provider>
}
