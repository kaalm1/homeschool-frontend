import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  KidsService,
  ActivitiesService,
  type KidResponse,
  type ActivityResponse,
} from '@/generated-api';

export default function ParentDashboard() {
  const [kids, setKids] = useState<KidResponse[]>([]);
  const [activities, setActivities] = useState<ActivityResponse[]>([]);

  useEffect(() => {
    (async () => {
      try {
        // Updated to match your API endpoint structure
        const k = await KidsService.getKidsApiV1KidsGet();
        setKids(k);

        // Updated to match your API - no query params needed to get all activities
        const a = await ActivitiesService.getActivitiesApiV1ActivitiesGet({kidId: undefined});
        setActivities(a);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    })();
  }, []);

  const byKid = useMemo(() => {
    const map: Record<number, ActivityResponse[]> = {};
    for (const a of activities) {
      if (a.kid_id) {
        map[a.kid_id] = map[a.kid_id] || [];
        map[a.kid_id].push(a);
      }
    }
    return map;
  }, [activities]);

  async function addQuickActivity(kid_id: number) {
    const title = prompt('Quick activity title (e.g., Read 10 minutes)');
    if (!title) return;

    try {
      // Updated to match your API structure - ActivityCreate expects different format
      const newActivity = await ActivitiesService.createActivityApiV1ActivitiesPost({
        requestBody: {
          title,
          kid_id,
          description: null, // Optional field from your ActivityCreate model
          costs: null,
          durations: null,
          participants: null,
          locations: null,
          seasons: null,
          age_groups: null,
          frequency: null,
          themes: null,
          types: null,
        },
      });
      setActivities((prev) => [...prev, newActivity]);
    } catch (err) {
      console.error('Error adding activity:', err);
    }
  }

  async function toggleActivity(activityId: number) {
    try {
      // Use the toggle endpoint from your API
      const updatedActivity = await ActivitiesService.toggleActivityApiV1ActivitiesActivityIdTogglePost({
        activityId,
      });
      
      setActivities((prev) =>
        prev.map((a) => (a.id === activityId ? updatedActivity : a))
      );
    } catch (err) {
      console.error('Error toggling activity:', err);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Parent Dashboard</h1>
        <div className="flex items-center space-x-3">
          <Link
            to="/activities"
            className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
          >
            Browse All Activities
          </Link>
          <Link
            to="/login"
            className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700 transition hover:bg-red-200"
          >
            Sign out
          </Link>
        </div>
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
                  <span className="flex-1">
                    {a.title}
                    {/* Show description if available */}
                    {a.description && (
                      <div className="text-xs text-slate-500 mt-1">{a.description}</div>
                    )}
                  </span>
                  <button
                    onClick={() => toggleActivity(a.id)}
                    className="ml-2 text-lg hover:scale-110 transition-transform"
                    title={a.done ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {a.done ? '✅' : '⬜️'}
                  </button>
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

      {kids.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No kids found. Add a kid to get started!</p>
          <Link
            to="/add-kid"
            className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Add First Kid
          </Link>
        </div>
      )}
    </div>
  );
}
