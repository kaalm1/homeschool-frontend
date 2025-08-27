import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  KidsService,
  ActivitiesService,
  type KidResponse,
  type ActivityResponse,
} from '@/generated-api';

// type Kid = { id: number; name: string; color: string }
// type Activity = { id: number; title: string; subject: string; kid_id: number; done: boolean }

export default function ParentDashboard() {
  const [kids, setKids] = useState<KidResponse[]>([]);
  const [activities, setActivities] = useState<ActivityResponse[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const k = await KidsService.getKidsApiV1KidsGet();
        setKids(k);

        const a = await ActivitiesService.getActivitiesApiV1ActivitiesGet({});
        setActivities(a);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    })();
  }, []);

  const byKid = useMemo(() => {
    const map: Record<number, ActivityResponse[]> = {};
    for (const a of activities) {
      map[a.kid_id] = map[a.kid_id] || [];
      map[a.kid_id].push(a);
    }
    return map;
  }, [activities]);

  async function addQuickActivity(kid_id: number) {
    const title = prompt('Quick activity title (e.g., Read 10 minutes)');
    if (!title) return;

    try {
      const newActivity = await ActivitiesService.createActivityApiV1ActivitiesPost({
        requestBody: {
          title,
          subject: 'General',
          kid_id,
        },
      });
      setActivities((prev) => [...prev, newActivity]);
    } catch (err) {
      console.error('Error adding activity:', err);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Parent Dashboard</h1>
        <Link
          to="/login"
          className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700 transition hover:bg-red-200"
        >
          Sign out
        </Link>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {kids.map((k) => (
          <div key={k.id} className="flex flex-col space-y-3 rounded-xl bg-white p-4 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{k.name}</h2>
              <Link
                to={`/kid/${k.id}`}
                className="rounded-full bg-blue-100 px-2 py-1 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
              >
                Open Kid View
              </Link>
            </div>

            <ul className="space-y-2">
              {(byKid[k.id] || []).map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-2"
                >
                  <span>
                    {a.title} <em className="text-xs text-slate-500">({a.subject})</em>
                  </span>
                  <span>{a.done ? '✅' : '⬜️'}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => addQuickActivity(k.id)}
              className="mt-3 w-full rounded-md bg-green-500 py-2 font-semibold text-white transition hover:bg-green-600"
            >
              + Quick Activity
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
