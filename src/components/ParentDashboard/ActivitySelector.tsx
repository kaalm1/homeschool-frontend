import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  Gamepad2,
  BookOpen,
  Users,
  Clock,
  ChevronRight,
  Plus,
  Palette,
  TreePine,
  UtensilsCrossed,
  PartyPopper,
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
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Theme, ActivityType, Duration, ActivityResponse } from '@/generated-api';

// Filter types
export type FilterValue = {
  label: string;
  value: string;
  count?: number;
};

export type TagCategory =
  | 'themes'
  | 'activity_types'
  | 'age_groups'
  | 'locations'
  | 'seasons'
  | 'participants'
  | 'costs'
  | 'durations';

export interface ActivityFilters {
  [key: string]: FilterValue[];
}

export interface SelectedFilters {
  [key: string]: string[];
}

interface ActivitySelectorProps {
  activities: ActivityResponse[];
  weekActivities: Array<{ activity_id: number }>;
  onAddActivity: (activityId: number) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  onClose: () => void;
}

// Helper functions
const hasFilterMatch = (
  activity: ActivityResponse,
  filterType: TagCategory,
  selectedValues: string[]
): boolean => {
  const activityValue = activity[filterType] as string | string[] | undefined;

  if (!activityValue) return false;

  if (Array.isArray(activityValue)) {
    return selectedValues.some((value) => activityValue.includes(value));
  }

  if (typeof activityValue === 'string') {
    return selectedValues.includes(activityValue);
  }

  return false;
};

const extractFiltersFromActivities = (activities: ActivityResponse[]): ActivityFilters => {
  const filters: ActivityFilters = {
    themes: [],
    activity_types: [],
    age_groups: [],
    locations: [],
    seasons: [],
    participants: [],
    costs: [],
    durations: [],
  };

  const uniqueValues: { [key: string]: Map<string, number> } = {
    themes: new Map(),
    activity_types: new Map(),
    age_groups: new Map(),
    locations: new Map(),
    seasons: new Map(),
    participants: new Map(),
    costs: new Map(),
    durations: new Map(),
  };

  activities.forEach((activity) => {
    Object.keys(filters).forEach((filterType) => {
      const value = activity[filterType as keyof ActivityResponse];

      if (Array.isArray(value)) {
        value.forEach((item) => {
          const current = uniqueValues[filterType].get(item) || 0;
          uniqueValues[filterType].set(item, current + 1);
        });
      } else if (typeof value === 'string' && value.trim()) {
        const current = uniqueValues[filterType].get(value) || 0;
        uniqueValues[filterType].set(value, current + 1);
      }
    });
  });

  // Convert maps to FilterValue arrays with counts
  Object.keys(filters).forEach((filterType) => {
    filters[filterType] = Array.from(uniqueValues[filterType].entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([value, count]) => ({
        label: formatLabel(value),
        value,
        count,
      }));
  });

  return filters;
};

const formatLabel = (value: string): string => {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const getFilterCategoryDisplayName = (category: string): string => {
  const displayNames: { [key: string]: string } = {
    themes: 'Themes',
    activity_types: 'Activity Types',
    age_groups: 'Age Groups',
    locations: 'Locations',
    seasons: 'Seasons',
    participants: 'Group Size',
    costs: 'Cost',
    durations: 'Duration',
  };
  return displayNames[category] || formatLabel(category);
};

const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  activities = [],
  weekActivities = [],
  onAddActivity,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['themes', 'activity_types'])
  );

  // Extract available filters from activities
  const availableFilters = useMemo(() => extractFiltersFromActivities(activities), [activities]);

  // Filter activities based on search and selected filters
  const filteredActivities = useMemo(() => {
    return activities.filter((activity: ActivityResponse) => {
      // Search filter
      if (
        searchTerm &&
        !activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(activity.description ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Selected filters
      for (const [filterType, selectedValues] of Object.entries(selectedFilters) as [
        TagCategory,
        string[],
      ][]) {
        if (selectedValues.length > 0 && !hasFilterMatch(activity, filterType, selectedValues)) {
          return false;
        }
      }

      return true;
    });
  }, [activities, searchTerm, selectedFilters]);

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      const current = prev[filterType] || [];
      if (checked) {
        return { ...prev, [filterType]: [...current, value] };
      } else {
        return { ...prev, [filterType]: current.filter((v) => v !== value) };
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(selectedFilters).reduce((sum, filters) => sum + filters.length, 0);
  };

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

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

    if (type && iconMap[type]) {
      return iconMap[type];
    }

    if (types && types.length > 0) {
      const firstType = types[0];
      if (iconMap[firstType]) {
        return iconMap[firstType];
      }
    }

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

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div
      onClick={onClose}
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[95vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl"
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

        {/* Search and Filter Controls */}
        <div className="border-b border-gray-100 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 font-medium transition-all ${
                  isFilterOpen || activeFiltersCount > 0
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-opacity-20 ml-1 rounded-full bg-white px-2 py-0.5 text-xs font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              )}

              <span className="text-sm text-gray-600">{filteredActivities.length} activities</span>
            </div>
          </div>

          {/* Active Filter Tags */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(selectedFilters).map(([filterType, values]) =>
                values.map((value) => (
                  <span
                    key={`${filterType}-${value}`}
                    className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
                  >
                    {formatLabel(value)}
                    <button
                      onClick={() => handleFilterChange(filterType, value, false)}
                      className="ml-1 rounded-full hover:bg-blue-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="w-80 border-r border-gray-100 bg-gray-50">
              <div className="h-full overflow-y-auto p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Filters</h3>
                <div className="space-y-4">
                  {Object.entries(availableFilters).map(([filterType, options]) => {
                    if (!options.length) return null;

                    const isExpanded = expandedCategories.has(filterType);
                    const selectedCount = selectedFilters[filterType]?.length || 0;

                    return (
                      <div key={filterType} className="rounded-lg border border-gray-200 bg-white">
                        <button
                          onClick={() => toggleCategoryExpansion(filterType)}
                          className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {getFilterCategoryDisplayName(filterType)}
                            </span>
                            {selectedCount > 0 && (
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                                {selectedCount}
                              </span>
                            )}
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="border-t border-gray-100 p-4 pt-2">
                            <div className="max-h-48 space-y-2 overflow-y-auto">
                              {options.map((option) => {
                                const isSelected =
                                  selectedFilters[filterType]?.includes(option.value) || false;
                                return (
                                  <label
                                    key={option.value}
                                    className="flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-1 hover:bg-gray-50"
                                  >
                                    <div className="flex min-w-0 flex-1 items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) =>
                                          handleFilterChange(
                                            filterType,
                                            option.value,
                                            e.target.checked
                                          )
                                        }
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="truncate text-sm text-gray-700">
                                        {option.label}
                                      </span>
                                    </div>
                                    <span className="flex-shrink-0 text-xs text-gray-500">
                                      {option.count}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

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
                              {formatLabel(
                                activity.primary_theme ||
                                  (activity.themes && activity.themes[0]) ||
                                  ''
                              )}
                            </span>
                          )}
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {getDurationDisplay(activity.durations)}
                          </div>
                          {(activity.primary_type || activity.activity_types) && (
                            <div className="text-xs text-gray-500">
                              {formatLabel(
                                activity.primary_type ||
                                  (activity.activity_types && activity.activity_types[0]) ||
                                  ''
                              )}
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
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySelector;
