import { useEffect, useState } from 'react'
import { databases, DB } from '../lib/appwrite'
import { Query } from 'appwrite'
const cards = [['products', 'Products'], ['orders', 'Orders'], ['inquiries', 'Inquiries'], ['services', 'Services']]
export default function Overview() {
  const [n, setN] = useState<Record<string, number | string>>({})
  useEffect(() => { cards.forEach(([id]) =>
    databases.listDocuments(DB, id, [Query.limit(1)]).then((r) => setN((s) => ({ ...s, [id]: r.total })))
      .catch(() => setN((s) => ({ ...s, [id]: 'Error' })))) }, [])
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(([id, label]) => <div key={id} className="bg-white rounded-xl shadow p-4"><div className="text-sm text-slate-500">{label}</div><div className="text-3xl font-bold">{n[id] ?? '…'}</div></div>)}
      </div>
    </div>
  )
}
