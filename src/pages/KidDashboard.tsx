import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  KidsService,
  ActivitiesService,
  type KidResponse,
  type ActivityResponse,
} from '@/generated-api';

export default function KidDashboard() {
  const { kidId } = useParams();
  const [items, setItems] = useState<ActivityResponse[]>([]);
  const [kidName, setKidName] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        // Get all kids
        const kids: KidResponse[] = await KidsService.getKidsApiV1KidsGet();
        const kid = kids.find((k) => String(k.id) === String(kidId));
        setKidName(kid?.name || 'Kid');

        // Get activities for this kid
        const activities: ActivityResponse[] =
          await ActivitiesService.getActivitiesApiV1ActivitiesGet({
            kidId: kid ? kid.id : undefined,
          });
        setItems(activities);
      } catch (err) {
        console.error('Error fetching kid or activities', err);
      }
    })();
  }, [kidId]);

  async function toggleDone(id: number) {
    try {
      const updated: ActivityResponse =
        await ActivitiesService.toggleActivityApiV1ActivitiesActivityIdTogglePost({
          activityId: id,
        });
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } catch (err) {
      console.error('Error toggling activity', err);
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-xl space-y-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hi {kidName}!</h1>
        <Link
          to="/settings"
          className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700 transition hover:bg-purple-200"
        >
          Settings
        </Link>
        <Link
          to="/parent"
          className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
        >
          Parent
        </Link>
      </header>

      <div className="space-y-2 rounded-xl bg-white p-4 shadow-md">
        {items.map((i) => (
          <button
            key={i.id}
            onClick={() => toggleDone(i.id)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-3 text-left transition hover:bg-gray-50"
          >
            <span className="text-lg">{i.title}</span>
            <span className="text-xl">{i.done ? '⭐️' : '⬜️'}</span>
          </button>
        ))}

        {items.length === 0 && (
          <p className="text-slate-500">No tasks yet. Ask your grown-up to add some!</p>
        )}
      </div>
    </div>
  );
}
