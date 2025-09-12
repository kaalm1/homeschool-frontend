import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ActivitiesService,
  WeekActivitiesService,
  type ActivityResponse,
  type WeekActivityResponse,
} from '@/generated-api';
import { type SelectedFilters, useActivityFiltering } from '@/components/SearchAndFilter';
import { Star, CheckSquare, Square, Trash2 } from 'lucide-react';
import ActivitySelector from '@/components/ActivitySelector';

export enum WeekStatus {
  Past = 'past',
  Current = 'current',
  Future = 'future',
}

// Helper function to get ISO week number
export function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function getWeekStatus(year: number, week: number): WeekStatus {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentWeek = getISOWeek(today);

  if (year < currentYear) return WeekStatus.Past;
  if (year > currentYear) return WeekStatus.Future;

  // same year
  if (week < currentWeek) return WeekStatus.Past;
  if (week > currentWeek) return WeekStatus.Future;
  return WeekStatus.Current;
}

export default function ParentDashboard() {
  const [allActivities, setAllActivities] = useState<ActivityResponse[]>([]);
  const [weekActivities, setWeekActivities] = useState<WeekActivityResponse[]>([]);
  const [availableWeeks, setAvailableWeeks] = useState<Array<Record<string, any>>>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedWeek, setSelectedWeek] = useState<number>(getISOWeek(new Date()));
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});

  const availableActivities = allActivities.filter((activity) => {
    return activity;
  });

  const filteredActivities = useActivityFiltering(availableActivities, searchTerm, selectedFilters);

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedWeek]);

  async function fetchData() {
    try {
      // Fetch all activities (for adding to weeks)
      const a = await ActivitiesService.getActivitiesApiV1ActivitiesGet({ kidId: undefined });
      setAllActivities(a);

      // Fetch week activities for selected week
      const weekActs =
        await WeekActivitiesService.getWeekActivitiesApiV1WeekActivitiesWeekActivitiesGet({
          year: selectedYear,
          week: selectedWeek,
          completedOnly: undefined,
        });
      setWeekActivities(weekActs);

      // Fetch available weeks
      const weeks =
        await WeekActivitiesService.getAvailableWeeksApiV1WeekActivitiesWeekActivitiesWeeksGet();
      setAvailableWeeks(weeks);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  }

  async function toggleWeekActivity(weekActivityId: number) {
    try {
      const updatedWeekActivity =
        await WeekActivitiesService.toggleWeekActivityApiV1WeekActivitiesWeekActivitiesWeekActivityIdTogglePost(
          {
            weekActivityId,
          }
        );

      setWeekActivities((prev) =>
        prev.map((wa) => (wa.id === weekActivityId ? updatedWeekActivity : wa))
      );

      // Refresh summary
      fetchData();
    } catch (err) {
      console.error('Error toggling week activity:', err);
    }
  }

  async function updateWeekActivityRating(weekActivityId: number, rating: number, notes?: string) {
    try {
      const updatedWeekActivity =
        await WeekActivitiesService.updateWeekActivityApiV1WeekActivitiesWeekActivitiesWeekActivityIdPut(
          {
            weekActivityId,
            requestBody: {
              rating,
              notes: notes || null,
            },
          }
        );

      setWeekActivities((prev) =>
        prev.map((wa) => (wa.id === weekActivityId ? updatedWeekActivity : wa))
      );
    } catch (err) {
      console.error('Error updating week activity rating:', err);
    }
  }

  async function addActivityToWeek(activityId: number) {
    try {
      const newWeekActivity =
        await WeekActivitiesService.createWeekActivityApiV1WeekActivitiesWeekActivitiesPost({
          requestBody: {
            activity_id: activityId,
            activity_year: selectedYear,
            activity_week: selectedWeek,
          },
        });

      setWeekActivities((prev) => [...prev, newWeekActivity]);
      setShowAddActivityModal(false);
      fetchData(); // Refresh summary
    } catch (err) {
      console.error('Error adding activity to week:', err);
    }
  }

  async function removeActivityFromWeek(kidId: number | null, activityId: number) {
    try {
      await WeekActivitiesService.removeActivityFromWeekApiV1WeekActivitiesWeekActivitiesRemoveDelete(
        {
          activityId,
          year: selectedYear,
          week: selectedWeek,
        }
      );

      // Remove from local state
      setWeekActivities((prev) =>
        prev.filter((wa) => !(wa.user_id === kidId && wa.activity_id === activityId))
      );
      fetchData(); // Refresh summary
    } catch (err) {
      console.error('Error removing activity from week:', err);
    }
  }

  function goToCurrentWeek() {
    const now = new Date();
    setSelectedYear(now.getFullYear());
    setSelectedWeek(getISOWeek(now));
  }

  function navigateWeek(direction: 'prev' | 'next') {
    let newWeek = selectedWeek + (direction === 'next' ? 1 : -1);
    let newYear = selectedYear;

    if (newWeek > 53) {
      newWeek = 1;
      newYear++;
    } else if (newWeek < 1) {
      newWeek = 53;
      newYear--;
    }

    setSelectedWeek(newWeek);
    setSelectedYear(newYear);
  }

  const weekStatus = getWeekStatus(selectedYear, selectedWeek);
  const isCurrentWeek = weekStatus === WeekStatus.Current;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Weekly Activities Dashboard</h1>
        <div className="flex items-center space-x-3">
          <Link
            to="/activities"
            className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
          >
            Browse All Activities
          </Link>
          <Link
            to="/settings"
            className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-200"
          >
            Family Settings
          </Link>
          <Link
            to="/login"
            className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700 transition hover:bg-red-200"
          >
            Sign out
          </Link>
        </div>
      </header>

      {/* Week Navigation */}
      <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
          >
            ←
          </button>
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              Week {selectedWeek}, {selectedYear}
            </h2>
            {isCurrentWeek && <span className="text-sm text-green-600">Current Week</span>}
          </div>
          <button
            onClick={() => navigateWeek('next')}
            className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
          >
            →
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {!isCurrentWeek && (
            <button
              onClick={goToCurrentWeek}
              className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
            >
              Go to Current Week
            </button>
          )}
          <select
            value={`${selectedYear}-${selectedWeek}`}
            onChange={(e) => {
              const [year, week] = e.target.value.split('-');
              setSelectedYear(parseInt(year));
              setSelectedWeek(parseInt(week));
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value={`${selectedYear}-${selectedWeek}`}>
              Current: Week {selectedWeek}, {selectedYear}
            </option>
            {availableWeeks.map((week, idx) => (
              <option key={idx} value={`${week.year}-${week.week}`}>
                Week {week.week}, {week.year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Family Activities Card */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Family Activities</h3>
          {weekStatus != WeekStatus.Past && (
            <button
              onClick={() => {
                setShowAddActivityModal(true);
              }}
              className="rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
            >
              + Add Family Activity
            </button>
          )}
        </div>

        <div className="space-y-3">
          {weekActivities.map((wa) => (
            <div
              key={wa.id}
              className={`rounded-lg border p-4 ${
                wa.completed ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="flex items-center font-medium">{wa.activity_title}</h4>
                  {wa.activity_description && (
                    <p className="mt-1 text-sm text-gray-600">{wa.activity_description}</p>
                  )}
                  {wa.notes && <p className="mt-2 text-sm text-gray-500 italic">"{wa.notes}"</p>}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleWeekActivity(wa.id)}
                    className="text-2xl transition-transform hover:scale-110"
                    title={wa.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {wa.completed ? (
                      <CheckSquare className="h-6 w-6 text-green-500" />
                    ) : (
                      <Square className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => removeActivityFromWeek(null, wa.activity_id)} // Use null for family activities
                    className="text-red-500 hover:text-red-700"
                    title="Remove from week"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Rating Section */}
              {weekStatus !== WeekStatus.Future && (
                <div className="mt-3 flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Family Rating:</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (wa.rating || 0) >= star;
                      return (
                        <button
                          key={star}
                          onClick={() => updateWeekActivityRating(wa.id, star)}
                          className="hover:text-yellow-400"
                        >
                          {isFilled ? (
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <Star className="h-5 w-5 text-gray-300" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes input */}
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Add family notes..."
                  defaultValue={wa.notes || ''}
                  onBlur={(e) => {
                    if (e.target.value !== (wa.notes || '')) {
                      updateWeekActivityRating(wa.id, wa.rating || 0, e.target.value);
                    }
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                />
              </div>
            </div>
          ))}

          {weekActivities.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              <div className="mb-2 text-4xl">👨‍👩‍👧‍👦</div>
              <p className="text-lg">No family activities for this week</p>
              <p className="mt-1 text-sm">
                Add activities that the whole family can enjoy together!
              </p>
              {weekStatus != WeekStatus.Past && (
                <button
                  onClick={() => {
                    setShowAddActivityModal(true);
                  }}
                  className="mt-3 font-medium text-purple-600 hover:text-purple-800"
                >
                  Add the first family activity
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      {showAddActivityModal && (
        <ActivitySelector
          activities={filteredActivities.filter(
            (activity) => !weekActivities.some((wa) => wa.activity_id === activity.id)
          )}
          weekActivities={weekActivities}
          onAddActivity={addActivityToWeek}
          onClose={() => {
            setShowAddActivityModal(false);
            setSearchTerm('');
            setSelectedFilters({});
          }}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}
    </div>
  );
}
