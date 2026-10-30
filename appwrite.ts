import { Account, Client, Databases, Storage } from 'appwrite'
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const DB = import.meta.env.VITE_APPWRITE_DATABASE_ID as string
export const BUCKET = import.meta.env.VITE_APPWRITE_BUCKET_ID as string
