
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

type Kid = { id: number; name: string; color: string }
type Activity = { id: number; title: string; subject: string; kid_id: number; done: boolean }

export default function ParentDashboard() {
  const [kids, setKids] = useState<Kid[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const token = localStorage.getItem('token')
  const api = axios.create({ baseURL: import.meta.env.VITE_API_URL, headers: { Authorization: `Bearer ${token}` } })

  useEffect(() => {
    (async () => {
      const k = await api.get('/kids')
      setKids(k.data)
      const a = await api.get('/schedule/today')
      setActivities(a.data)
    })()
  }, [])

  const byKid = useMemo(() => {
    const map: Record<number, Activity[]> = {}
    for (const a of activities) {
      map[a.kid_id] = map[a.kid_id] || []
      map[a.kid_id].push(a)
    }
    return map
  }, [activities])

  async function addQuickActivity(kid_id: number) {
    const title = prompt('Quick activity title (e.g., Read 10 minutes)')
    if (!title) return
    const res = await api.post('/schedule/add', { title, subject: 'General', kid_id })
    setActivities(prev => [...prev, res.data])
  }

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Parent Dashboard</h1>
        <Link to="/login" className="badge">Sign out</Link>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        {kids.map(k => (
          <div key={k.id} className="card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{k.name}</h2>
              <Link to={`/kid/${k.id}`} className="badge">Open Kid View</Link>
            </div>
            <ul className="mt-3 space-y-2">
              {(byKid[k.id] || []).map(a => (
                <li key={a.id} className="flex items-center justify-between border rounded-xl p-2">
                  <span>{a.title} <em className="text-xs text-slate-500">({a.subject})</em></span>
                  <span>{a.done ? '✅' : '⬜️'}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => addQuickActivity(k.id)} className="btn mt-3 w-full">+ Quick Activity</button>
          </div>
        ))}
      </div>
    </div>
  )
}
