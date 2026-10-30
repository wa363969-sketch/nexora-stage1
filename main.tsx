import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './auth/AuthContext'
import Guard from './auth/Guard'
import Login from './pages/Login'
import Reset from './pages/Reset'
import AdminLayout from './admin/AdminLayout'
import Overview from './admin/Overview'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><AuthProvider><Routes>
    <Route path="/" element={<div className="p-8">Public site arrives in Stage 2.</div>} />
    <Route path="/admin/login" element={<Login />} />
    <Route path="/admin/reset" element={<Reset />} />
    <Route path="/admin" element={<Guard><AdminLayout /></Guard>}><Route index element={<Overview />} /></Route>
  </Routes></AuthProvider></BrowserRouter></React.StrictMode>)
