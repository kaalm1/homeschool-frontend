import React, { useState } from 'react';
import {
  Search,
  Filter,
  X,
  Gamepad2,
  Camera,
  BookOpen,
  Calculator,
  Users,
  Clock,
  ChevronRight,
  Plus,
  Palette,
  TreePine,
  Heart,
  Zap,
  UtensilsCrossed,
  PartyPopper,
  Brain,
  Smile,
  UserCheck,
  Mountain,
  Home,
  Music,
  Puzzle,
  FlaskConical,
  BookText,
  Car,
  Headphones,
  HandHeart,
  Trophy,
  Fish,
} from 'lucide-react';

// Types based on your API
enum Theme {
  ADVENTURE = 'adventure',
  CREATIVE = 'creative',
  EDUCATIONAL = 'educational',
  FITNESS = 'fitness',
  FOOD_DRINK = 'food_drink',
  FESTIVE = 'festive',
  MINDFULNESS = 'mindfulness',
  NATURE = 'nature',
  RELAXATION = 'relaxation',
  SOCIAL = 'social',
}

enum ActivityType {
  AMUSEMENT_PARK = 'amusement_park',
  ARTS_CRAFTS = 'arts_crafts',
  BOARD_GAMES = 'board_games',
  CLASSES = 'classes',
  DANCE = 'dance',
  FESTIVAL = 'festival',
  GAMES = 'games',
  GARDENING = 'gardening',
  HIKING = 'hiking',
  INDOOR = 'indoor',
  MUSIC = 'music',
  OUTDOOR = 'outdoor',
  PARK = 'park',
  PUZZLES = 'puzzles',
  SCIENCE_TECH = 'science_tech',
  STORYTELLING = 'storytelling',
  TRAVEL = 'travel',
  VIDEO_GAMES = 'video_games',
  VOLUNTEERING = 'volunteering',
  SPORTS = 'sports',
  ZOO_AQUARIUM = 'zoo_aquarium',
}

enum Duration {
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long',
  FULL_DAY = 'full_day',
  MULTI_DAY = 'multi_day',
}

import { type ActivityResponse } from '@/generated-api';

interface ActivitySelectorProps {
  activities: ActivityResponse[];
  weekActivities: Array<{ activity_id: number }>;
  onAddActivity: (activityId: number) => void;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  activities = [],
  weekActivities = [],
  onAddActivity,
  onClose,
  searchTerm = '',
  onSearchChange,
}) => {
  //   const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredActivities = activities.filter(
    (activity) =>
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.description &&
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addActivityToWeek = (activityId: number) => {
    onAddActivity(activityId);
  };

  // Icon mappings for activity types
  const getActivityTypeIcon = (type?: ActivityType | null, types?: ActivityType[] | null) => {
    const iconMap: Record<ActivityType, React.ElementType> = {
      [ActivityType.AMUSEMENT_PARK]: PartyPopper,
      [ActivityType.ARTS_CRAFTS]: Palette,
      [ActivityType.BOARD_GAMES]: Gamepad2,
      [ActivityType.CLASSES]: BookOpen,
      [ActivityType.DANCE]: Music,
      [ActivityType.FESTIVAL]: PartyPopper,
      [ActivityType.GAMES]: Gamepad2,
      [ActivityType.GARDENING]: TreePine,
      [ActivityType.HIKING]: Mountain,
      [ActivityType.INDOOR]: Home,
      [ActivityType.MUSIC]: Music,
      [ActivityType.OUTDOOR]: TreePine,
      [ActivityType.PARK]: TreePine,
      [ActivityType.PUZZLES]: Puzzle,
      [ActivityType.SCIENCE_TECH]: FlaskConical,
      [ActivityType.STORYTELLING]: BookText,
      [ActivityType.TRAVEL]: Car,
      [ActivityType.VIDEO_GAMES]: Headphones,
      [ActivityType.VOLUNTEERING]: HandHeart,
      [ActivityType.SPORTS]: Trophy,
      [ActivityType.ZOO_AQUARIUM]: Fish,
    };

    // Prefer primary type if available
    if (type && iconMap[type]) {
      return iconMap[type];
    }

    // Fall back to first in types array
    if (types && types.length > 0) {
      const firstType = types[0];
      if (iconMap[firstType]) {
        return iconMap[firstType];
      }
    }

    // Final fallback: generic icon
    return Users;
  };

  // Theme color mappings
  const getThemeColor = (theme?: Theme | null, themes?: Theme[] | null) => {
    const colorMap: Record<Theme, string> = {
      [Theme.ADVENTURE]: 'bg-orange-100 text-orange-800',
      [Theme.CREATIVE]: 'bg-purple-100 text-purple-800',
      [Theme.EDUCATIONAL]: 'bg-blue-100 text-blue-800',
      [Theme.FITNESS]: 'bg-green-100 text-green-800',
      [Theme.FOOD_DRINK]: 'bg-yellow-100 text-yellow-800',
      [Theme.FESTIVE]: 'bg-pink-100 text-pink-800',
      [Theme.MINDFULNESS]: 'bg-indigo-100 text-indigo-800',
      [Theme.NATURE]: 'bg-emerald-100 text-emerald-800',
      [Theme.RELAXATION]: 'bg-cyan-100 text-cyan-800',
      [Theme.SOCIAL]: 'bg-rose-100 text-rose-800',
    };

    const selected = theme || (themes && themes.length > 0 ? themes[0] : null);

    return selected && colorMap[selected] ? colorMap[selected] : 'bg-gray-100 text-gray-800';
  };

  // Duration display mapping
  const getDurationDisplay = (durations?: Duration[] | null) => {
    if (!durations || durations.length === 0) return 'Variable';

    // Use the first/shortest duration
    const duration = durations[0];
    const durationMap = {
      [Duration.SHORT]: '15-30 min',
      [Duration.MEDIUM]: '30-60 min',
      [Duration.LONG]: '1-2 hours',
      [Duration.FULL_DAY]: 'Full day',
      [Duration.MULTI_DAY]: 'Multi-day',
    };
    return durationMap[duration] || 'Variable';
  };

  // Format theme/type for display
  const formatLabel = (value?: string | null, values?: string[] | null) => {
    const label = value || (values && values.length > 0 ? values[0] : null);
    if (!label) return '';

    return label
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div
      onClick={onClose}
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Family Activity</h2>
            <p className="mt-1 text-sm text-gray-600">Choose an activity to add to your week</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4 border-b border-gray-100 p-6">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 transition-colors hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <span className="text-sm text-gray-600">
              Showing {filteredActivities.length} activities
            </span>
          </div>
        </div>

        {/* Activities List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {filteredActivities.map((activity) => {
              const IconComponent = getActivityTypeIcon(
                activity.primary_type,
                activity.activity_types
              );
              return (
                <div
                  key={activity.id}
                  onClick={() => addActivityToWeek(activity.id)}
                  className="group relative cursor-pointer rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
                >
                  {/* Main Content */}
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 transition-transform group-hover:scale-110">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                            {activity.title}
                          </h3>
                          {activity.description && (
                            <p className="mt-1 text-sm leading-relaxed text-gray-600">
                              {activity.description}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-blue-500" />
                      </div>

                      {/* Meta Information */}
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        {(activity.primary_theme || activity.themes) && (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getThemeColor(activity.primary_theme, activity.themes)}`}
                          >
                            {formatLabel(activity.primary_theme, activity.themes)}
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {getDurationDisplay(activity.durations)}
                        </div>
                        {(activity.primary_type || activity.activity_types) && (
                          <div className="text-xs text-gray-500">
                            {formatLabel(activity.primary_type, activity.activity_types)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add Button (appears on hover) */}
                  <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 shadow-lg">
                      <Plus className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Hover Gradient Overlay */}
                  <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-purple-50/0 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredActivities.length === 0 && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">No activities found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {/* <div className="rounded-b-2xl border-t border-gray-100 bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              Perfect for family time
            </div>
            <button className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700">
              Browse All Activities
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ActivitySelector;
