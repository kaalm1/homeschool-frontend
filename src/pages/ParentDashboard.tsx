
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { KidsService, ActivitiesService, type KidResponse, type ActivityResponse } from '@/generated-api'

// type Kid = { id: number; name: string; color: string }
// type Activity = { id: number; title: string; subject: string; kid_id: number; done: boolean }

export default function ParentDashboard() {
  const [kids, setKids] = useState<KidResponse[]>([])
  const [activities, setActivities] = useState<ActivityResponse[]>([])
  const token = localStorage.getItem('token')
  const api = axios.create({ baseURL: import.meta.env.VITE_API_URL, headers: { Authorization: `Bearer ${token}` } })

  useEffect(() => {
    ;(async () => {
      try {
        const k = await KidsService.getKidsApiV1KidsGet()
        setKids(k)

        const a = await ActivitiesService.getActivitiesApiV1ActivitiesGet({})
        setActivities(a)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      }
    })()
  }, [])

  const byKid = useMemo(() => {
    const map: Record<number, ActivityResponse[]> = {}
    for (const a of activities) {
      map[a.kid_id] = map[a.kid_id] || []
      map[a.kid_id].push(a)
    }
    return map
  }, [activities])

  async function addQuickActivity(kid_id: number) {
    const title = prompt('Quick activity title (e.g., Read 10 minutes)')
    if (!title) return

    try {
      const newActivity = await ActivitiesService.createActivityApiV1ActivitiesPost({
        requestBody: {
          title,
          subject: 'General',
          kid_id,
        },
      })
      setActivities(prev => [...prev, newActivity])
    } catch (err) {
      console.error('Error adding activity:', err)
    }
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
