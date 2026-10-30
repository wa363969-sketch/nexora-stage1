// Creates DB, collections, indexes, permissions and the media bucket. Safe to re-run.
import { Client, Databases, Storage, Permission, Role } from 'node-appwrite'
const { APPWRITE_ENDPOINT: ep, APPWRITE_PROJECT_ID: pid, APPWRITE_API_KEY: key } = process.env
if (!ep || !pid || !key) throw new Error('Set APPWRITE_* env vars first (see .env.example)')
const c = new Client().setEndpoint(ep).setProject(pid).setKey(key)
const db = new Databases(c), st = new Storage(c)
const DB = process.env.VITE_APPWRITE_DATABASE_ID || 'nexora'
const owner = Role.label('owner'), staff = Role.label('staff')
const all = (r) => ['read', 'create', 'update', 'delete'].map((p) => Permission[p](r))
const adminPerms = all(owner)
const S = (k, size, req = false) => ({ k, t: 'string', size, req })
const F = (k, req = false) => ({ k, t: 'float', req }), I = (k) => ({ k, t: 'int' }), B = (k) => ({ k, t: 'bool' })
const E = (k, els) => ({ k, t: 'enum', els })
const st3 = ['draft', 'published', 'archived']
// Drafts are private; only owner/server copies draft -> *_published (public read).
const cols = {
  site_content_draft: { perms: [...adminPerms, Permission.read(staff), Permission.update(staff)], attrs: [S('key', 64, true), S('data', 1000000, true)], idx: ['key'] },
  site_content_published: { perms: [Permission.read(Role.any()), ...adminPerms], attrs: [S('key', 64, true), S('data', 1000000, true)], idx: ['key'] },
  products: { perms: adminPerms, docSec: true, attrs: [S('name', 200, true), S('slug', 200, true), S('description', 8000), F('price', true), S('category', 100), I('stock'), B('featured'), E('status', st3), S('imageId', 64)], idx: ['slug', 'status', 'category'] },
  services: { perms: adminPerms, docSec: true, attrs: [S('title', 200, true), S('description', 8000), E('status', st3), S('imageId', 64)], idx: ['status'] },
  orders: { perms: adminPerms, attrs: [S('customerName', 200, true), S('email', 200, true), S('phone', 50), S('items', 20000, true), F('total', true), E('status', ['new', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']), S('fulfillment', 2000)], idx: ['status', 'email'] },
  inquiries: { perms: [Permission.create(Role.any()), ...adminPerms], attrs: [S('name', 200, true), S('email', 200, true), S('message', 5000, true), E('status', ['new', 'read', 'archived'])], idx: ['status'] },
  profiles: { perms: adminPerms, attrs: [S('userId', 64, true), E('role', ['customer', 'staff', 'owner']), B('suspended')], idx: ['userId'] },
  media: { perms: adminPerms, attrs: [S('fileId', 64, true), S('name', 255, true), S('mime', 100), I('size')], idx: ['fileId'] },
  audit_logs: { perms: [Permission.read(owner)], attrs: [S('actorId', 64, true), S('action', 100, true), S('target', 200), S('meta', 5000)], idx: ['actorId'] }, // written only by server API key
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const ok = async (p) => { try { await p } catch (e) { if (e.code !== 409) throw e } }
await ok(db.create(DB, 'Nexora'))
for (const [id, d] of Object.entries(cols)) {
  await ok(db.createCollection(DB, id, id, d.perms, !!d.docSec))
  for (const a of d.attrs) {
    if (a.t === 'string') await ok(db.createStringAttribute(DB, id, a.k, a.size, !!a.req))
    if (a.t === 'float') await ok(db.createFloatAttribute(DB, id, a.k, !!a.req))
    if (a.t === 'int') await ok(db.createIntegerAttribute(DB, id, a.k, false))
    if (a.t === 'bool') await ok(db.createBooleanAttribute(DB, id, a.k, false, false))
    if (a.t === 'enum') await ok(db.createEnumAttribute(DB, id, a.k, a.els, false, a.els[0]))
  }
  await sleep(3000) // attributes build asynchronously
  for (const k of d.idx) await ok(db.createIndex(DB, id, `idx_${k}`, 'key', [k]))
  console.log('✓', id)
}
await ok(st.createBucket(process.env.VITE_APPWRITE_BUCKET_ID || 'media', 'media',
  [Permission.read(Role.any()), ...all(owner)], false, true, 10_000_000,
  undefined, undefined, undefined, undefined, undefined, undefined,
  ['jpg', 'jpeg', 'png', 'webp', 'svg', 'ico', 'pdf']))
console.log('Done. Now create your user and add the "owner" label (see README).')
