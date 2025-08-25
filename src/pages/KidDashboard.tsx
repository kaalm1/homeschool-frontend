
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

type Activity = { id: number; title: string; subject: string; kid_id: number; done: boolean }

export default function KidDashboard() {
  const { kidId } = useParams()
  const token = localStorage.getItem('token')
  const api = axios.create({ baseURL: import.meta.env.VITE_API_URL, headers: { Authorization: `Bearer ${token}` } })
  const [items, setItems] = useState<Activity[]>([])
  const [kidName, setKidName] = useState<string>('')

  useEffect(() => {
    (async () => {
      const k = await api.get('/kids')
      const kid = k.data.find((x: any) => String(x.id) === String(kidId))
      setKidName(kid?.name || 'Kid')
      const a = await api.get('/schedule/today')
      setItems(a.data.filter((x: any) => String(x.kid_id) === String(kidId)))
    })()
  }, [kidId])

  async function toggleDone(id: number) {
    const res = await api.post('/schedule/toggle', { id })
    setItems(prev => prev.map(i => i.id === id ? res.data : i))
  }

  return (
    <div className="min-h-screen p-4 max-w-xl mx-auto space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hi {kidName}!</h1>
        <Link to="/parent" className="badge">Parent</Link>
      </header>
      <div className="card space-y-2">
        {items.map(i => (
          <button key={i.id} onClick={() => toggleDone(i.id)} className="w-full text-left border rounded-xl p-3 flex items-center justify-between">
            <span className="text-lg">{i.title}</span>
            <span className="text-xl">{i.done ? '⭐️' : '⬜️'}</span>
          </button>
        ))}
        {items.length === 0 && <p className="text-slate-500">No tasks yet. Ask your grown-up to add some!</p>}
      </div>
    </div>
  )
}
