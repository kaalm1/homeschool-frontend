import { useState } from 'react';
import { WeekActivitiesService, type WeekActivityResponse } from '@/generated-api';
import { Calendar, Sparkles, X, Loader2 } from 'lucide-react';

interface PlanWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWeekPlanned: (activities: WeekActivityResponse[]) => void;
  currentYear: number;
  currentWeek: number;
}

export default function PlanWeekModal({
  isOpen,
  onClose,
  onWeekPlanned,
  currentYear,
  currentWeek,
}: PlanWeekModalProps) {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);

  if (!isOpen) return null;

  // Generate week options (current week + next 8 weeks)
  const weekOptions = [];
  let optionYear = currentYear;
  let optionWeek = currentWeek;

  for (let i = 0; i < 9; i++) {
    weekOptions.push({ year: optionYear, week: optionWeek });

    optionWeek++;
    if (optionWeek > 53) {
      optionWeek = 1;
      optionYear++;
    }
  }

  const formatWeekOption = (year: number, week: number) => {
    if (year === currentYear && week === currentWeek) {
      return `This Week (Week ${week})`;
    } else if (year === currentYear && week === currentWeek + 1) {
      return `Next Week (Week ${week})`;
    } else {
      return `Week ${week}, ${year}`;
    }
  };

  const getWeekStartDate = (year: number, week: number) => {
    const jan1 = new Date(year, 0, 1);
    const days = (week - 1) * 7 - jan1.getDay() + 1;
    const monday = new Date(year, 0, 1 + days);
    return monday.toISOString().split('T')[0];
  };

  const handlePlanWeek = async () => {
    try {
      setIsPlanning(true);

      const weekStartDate = getWeekStartDate(selectedYear, selectedWeek);

      const plannedActivities =
        await WeekActivitiesService.planWeekActivitiesApiV1WeekActivitiesWeekActivitiesPlanWeekPost(
          {
            requestBody: {
              additional_notes: additionalNotes.trim() || null,
              target_week_start: weekStartDate,
            },
          }
        );

      onWeekPlanned(plannedActivities);
      onClose();

      // Reset form
      setAdditionalNotes('');
      setSelectedYear(currentYear);
      setSelectedWeek(currentWeek);
    } catch (error) {
      console.error('Error planning week:', error);
      // You might want to show an error toast here
    } finally {
      setIsPlanning(false);
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={isPlanning}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Plan Your Family Week</h2>
          <p className="mt-1 text-sm text-gray-600">
            Get personalized activity suggestions tailored for your family
          </p>
        </div>

        {/* Week Selection */}
        <div className="mb-4">
          <label className="mb-2 flex items-center text-sm font-medium text-gray-700">
            <Calendar className="mr-2 h-4 w-4" />
            Choose a week to plan
          </label>
          <select
            value={`${selectedYear}-${selectedWeek}`}
            onChange={(e) => {
              const [year, week] = e.target.value.split('-');
              setSelectedYear(parseInt(year));
              setSelectedWeek(parseInt(week));
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
            disabled={isPlanning}
          >
            {weekOptions.map(({ year, week }) => (
              <option key={`${year}-${week}`} value={`${year}-${week}`}>
                {formatWeekOption(year, week)}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Notes */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Optional: Any special considerations for this week?
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="e.g., Max has a soccer game Sunday, we're trying to save money this month, grandparents visiting..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
            disabled={isPlanning}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
            disabled={isPlanning}
          >
            Cancel
          </button>
          <button
            onClick={handlePlanWeek}
            disabled={isPlanning}
            className="flex flex-1 items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
          >
            {isPlanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Create My Week
              </>
            )}
          </button>
        </div>

        {/* Footer note */}
        <div className="mt-4 rounded-lg bg-purple-50 p-3">
          <p className="text-xs text-purple-700">
            💡 <strong>Smart suggestions:</strong> We'll recommend activities based on your family's
            preferences, current trends, and predicted weather conditions, then add them to your
            selected week.
          </p>
        </div>
      </div>
    </div>
  );
}
