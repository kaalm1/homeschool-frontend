import { useEffect, useState, useMemo } from 'react';
import { Search, Filter, Plus, Clock, Users, MapPin, Check, X, Edit3, Trash2 } from 'lucide-react';
import {
  ActivitiesService,
  LlmService,
  type ActivityResponse,
  type Duration,
  type Participants,
  type Cost,
  type Frequency,
  type Season,
  type AgeGroup,
  type Location,
  type Theme,
  type ActivityType,
  type ActivityScale,
} from '@/generated-api';
import Swal from 'sweetalert2';

type TagCategory =
  | 'themes'
  | 'activity_types'
  | 'locations'
  | 'costs'
  | 'durations'
  | 'participants'
  | 'seasons'
  | 'age_groups'
  | 'frequency';

type FilterValue =
  | string
  | Duration
  | Participants
  | Location
  | Cost
  | Season
  | AgeGroup
  | Frequency;

const DEFAULT_EDIT_FORM = {
  title: '',
  description: '',
  themes: [] as Theme[],
  activity_types: [] as ActivityType[],
  locations: [] as Location[],
  costs: [] as Cost[],
  durations: [] as Duration[],
  participants: [] as Participants[],
  seasons: [] as Season[],
  age_groups: [] as AgeGroup[],
  frequency: [] as Frequency[],
  activity_scale: undefined as ActivityScale | undefined,
};

function hasFilterMatch(
  activity: ActivityResponse,
  filterType: TagCategory,
  values: string[]
): boolean {
  const activityValues = (activity[filterType] as string[] | undefined) ?? [];
  return values.some((v) => activityValues.includes(v));
}

export default function ActivitiesBrowser() {
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [filters, setFilters] = useState<Record<string, { value: string; label: string }[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivityText, setNewActivityText] = useState('');
  const [addingActivity, setAddingActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(DEFAULT_EDIT_FORM);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedFilters, fetchedActivities] = await Promise.all([
          ActivitiesService.getActivityFiltersApiV1ActivitiesFiltersGet(),
          ActivitiesService.getActivitiesApiV1ActivitiesGet({}),
        ]);
        setFilters(fetchedFilters);
        setActivities(fetchedActivities);
      } catch (err) {
        console.error('Error loading activities/filters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter activities based on search term and selected filters
  const filteredActivities = useMemo(() => {
    return activities.filter((activity: ActivityResponse) => {
      if (
        searchTerm &&
        !activity.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(activity.description ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

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
      const currentValues = prev[filterType] || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);

      return { ...prev, [filterType]: newValues };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setSearchTerm('');
  };

  const getTotalActiveFilters = () => {
    return Object.values(selectedFilters).reduce((total, values) => total + values.length, 0);
  };

  const toggleActivity = async (activityId: number) => {
    try {
      const updated = await ActivitiesService.toggleActivityApiV1ActivitiesActivityIdTogglePost({
        activityId,
      });
      setActivities((prev) => prev.map((a) => (a.id === activityId ? updated : a)));
    } catch (err) {
      console.error('Failed to toggle activity:', err);
    }
  };

  const deleteActivity = async (activityId: number) => {
    const result = await Swal.fire({
      title: 'Delete Activity?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true, // Cancel on left, Delete on right
    });

    if (!result.isConfirmed) return;

    try {
      await ActivitiesService.deleteActivityApiV1ActivitiesActivityIdDelete({ activityId });
      setActivities((prev) => prev.filter((a) => a.id !== activityId));
    } catch (err) {
      console.error('Failed to delete activity:', err);
    }
  };

  const startEdit = (activity: ActivityResponse) => {
    setEditingActivity(activity.id);
    setEditForm({
      title: activity.title ?? '',
      description: activity.description ?? '',
      themes: activity.themes ?? [],
      activity_types: activity.activity_types ?? [],
      locations: activity.locations ?? [],
      costs: activity.costs ?? [],
      durations: activity.durations ?? [],
      participants: activity.participants ?? [],
      seasons: activity.seasons ?? [],
      age_groups: activity.age_groups ?? [],
      frequency: activity.frequency ?? [],
      activity_scale: activity.activity_scale ?? undefined,
    });
  };

  const cancelEdit = () => {
    setEditingActivity(null);
    setEditForm({
      title: '',
      description: '',
      themes: [],
      activity_types: [],
      locations: [],
      costs: [],
      durations: [],
      participants: [],
      seasons: [],
      age_groups: [],
      frequency: [],
      activity_scale: undefined,
    });
  };

  const handleTagChange = (tagCategory: string, value: string, checked: boolean) => {
    setEditForm((prev) => {
      const currentValues = (prev[tagCategory as keyof typeof prev] as string[]) || [];
      let newValues: string[];

      if (checked) {
        newValues = [...currentValues, value];
      } else {
        newValues = currentValues.filter((v) => v !== value);
      }

      return {
        ...prev,
        [tagCategory]: newValues,
      };
    });
  };

  const saveEdit = async () => {
    if (!editingActivity) return;

    try {
      await ActivitiesService.updateActivityApiV1ActivitiesActivityIdPatch({
        activityId: editingActivity,
        requestBody: editForm,
      });
      setActivities((prev) =>
        prev.map((a) =>
          a.id === editingActivity
            ? { ...a, title: editForm.title, description: editForm.description }
            : a
        )
      );
      setEditingActivity(null);
      setEditForm(DEFAULT_EDIT_FORM);
    } catch (err) {
      console.error('Failed to update activity:', err);
    }
  };

  const addActivities = async () => {
    if (!newActivityText.trim()) return;

    try {
      setAddingActivity(true);

      // Call LLM tagging API
      const response = await LlmService.tagActivitiesApiV1LlmLlmTagActivitiesPost({
        requestBody: { activities: newActivityText.trim() },
      });

      // Response shape: { tagged_activities: TaggedActivity[], total_count: number }
      const { tagged_activities } = response;

      if (!tagged_activities || tagged_activities.length === 0) {
        throw new Error('No activities were tagged');
      }

      // Map tagged activities into your local Activity shape
      const newActivities = tagged_activities.map((tagged) => ({
        ...tagged,
      }));

      // Prepend new activities
      setActivities((prev) => [...newActivities, ...prev]);

      setNewActivityText('');
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to add activity:', err);
      alert('Failed to add activity. Please try again.');
    } finally {
      setAddingActivity(false);
    }
  };

  const getTagColor = (type: TagCategory) => {
    const colorMap: Record<TagCategory, string> = {
      themes: 'bg-purple-100 text-purple-800',
      activity_types: 'bg-blue-100 text-blue-800',
      locations: 'bg-green-100 text-green-800',
      costs: 'bg-yellow-100 text-yellow-800',
      durations: 'bg-indigo-100 text-indigo-800',
      participants: 'bg-pink-100 text-pink-800',
      seasons: 'bg-orange-100 text-orange-800',
      age_groups: 'bg-teal-100 text-teal-800',
      frequency: 'bg-red-100 text-red-800',
    };

    return colorMap[type];
  };

  const getFilterLabel = (type: keyof typeof filters, value?: FilterValue): string => {
    if (!value) return '';
    return filters[type]?.find((f) => f.value === String(value))?.label ?? String(value);
  };

  // Helper function to format participants display
  const formatParticipants = (participants?: Participants[]): string => {
    if (!participants?.length) return '';

    if (participants.includes('family' as Participants)) {
      return '∞'; // Infinity symbol for family/unlimited
    }

    // Sort participants by typical order and get min-max range
    const playerCounts = participants
      .filter((p) => p !== 'family')
      .map((p) => {
        if (p === 'two_player') return 2;
        if (p === 'small_group') return 3;
        if (p === 'medium_group') return 6;
        if (p === 'large_group') return 10;
        if (p === 'solo') return 1;
        return 0;
      })
      .filter((n) => n > 0)
      .sort((a, b) => a - b);

    if (playerCounts.length === 0) return '';
    if (playerCounts.length === 1) {
      const count = playerCounts[0];
      if (count === 1) return '1';
      if (count === 2) return '2';
      if (count === 10) return '10+';
      if (count === 6) return '6-10';
      if (count === 3) return '3-5';
      return String(count);
    }

    const min = playerCounts[0];
    const max = playerCounts[playerCounts.length - 1];

    if (min === 1 && max >= 10) return '1+';
    if (min === 2 && max >= 10) return '2+';
    if (min === 3 && max >= 10) return '3+';

    return `${min}-${max === 10 ? '10+' : max}`;
  };

  // Helper function to format age groups display
  const formatAgeGroups = (ageGroups?: AgeGroup[]): string => {
    if (!ageGroups?.length) return '';

    const allAges = ['toddler', 'child', 'tween', 'teen', 'adult', 'family'];
    const selectedAges = ageGroups.filter((age) => allAges.includes(age as string));

    // If family is included, it's for all ages
    if (selectedAges.includes('family' as AgeGroup)) {
      return 'All Ages';
    }

    // If all specific age groups are selected
    if (selectedAges.length >= 4 && selectedAges.includes('toddler' as AgeGroup)) {
      return 'All Ages';
    }

    // If all except toddler
    if (selectedAges.length >= 3 && !selectedAges.includes('toddler' as AgeGroup)) {
      return 'Kids+';
    }

    // If just one age group
    if (selectedAges.length === 1) {
      return getFilterLabel('age_groups', selectedAges[0]);
    }

    // For multiple but not all, show range or count
    if (selectedAges.length === 2) {
      const labels = selectedAges.map((age) => getFilterLabel('age_groups', age));
      return labels.join(', ');
    }

    return `${selectedAges.length} Age Groups`;
  };

  // Helper function to format activity scale display
  const formatActivityScale = (scale?: string): string => {
    if (!scale) return '';

    const map: Record<string, string> = {
      small: 'S',
      medium: 'M',
      large: 'L',
      extra_large: 'XL',
    };

    return map[scale] || scale;
  };

  // Helper function to format cost display
  const formatCost = (costs?: Cost[]): string => {
    if (!costs?.length) return '';

    if (costs.includes('free' as Cost)) {
      if (costs.length === 1) return 'FREE';
      return 'FREE+'; // Has free options plus paid
    }

    // Map cost levels to symbols
    const costSymbols = costs
      .map((cost) => {
        if (cost === 'low') return '$';
        if (cost === 'medium') return '$$';
        if (cost === 'high') return '$$$';
        return cost;
      })
      .filter(Boolean);

    if (costSymbols.length === 1) return costSymbols[0];
    if (costSymbols.length > 1) return `${costSymbols[0]}-${costSymbols[costSymbols.length - 1]}`;

    return '';
  };

  // Helper function to get season display
  const formatSeasons = (seasons?: Season[]): string => {
    if (!seasons?.length) return '';

    // Check if "all" seasons is selected
    if (seasons.includes('all' as Season)) return 'Year-round';

    const seasonEmojis: Record<string, string> = {
      spring: '🌸',
      summer: '☀️',
      fall: '🍂',
      winter: '❄️',
      rainy_day: '🌧️',
      snowy_day: '☃️',
    };

    const standardSeasons = ['spring', 'summer', 'fall', 'winter'];
    const selectedStandardSeasons = seasons.filter((s) => standardSeasons.includes(s as string));

    if (selectedStandardSeasons.length === 4) return 'Year-round';
    if (seasons.length === 1)
      return seasonEmojis[seasons[0] as string] || getFilterLabel('seasons', seasons[0]);
    if (seasons.length <= 3) {
      return seasons
        .map((s) => seasonEmojis[s as string])
        .filter(Boolean)
        .join('');
    }

    return `${seasons.length} Seasons`;
  };

  const TagCheckboxGroup = ({
    tagCategory,
    options,
    selectedValues,
    onChange,
  }: {
    tagCategory: string;
    options: { value: string; label: string }[];
    selectedValues: string[];
    onChange: (category: string, value: string, checked: boolean) => void;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 capitalize">
        {tagCategory.replace('_', ' ')}
      </label>
      <div className="max-h-32 space-y-1 overflow-y-auto rounded-md border bg-gray-50 p-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={(e) => onChange(tagCategory, option.value, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              {/* <h1 className="text-2xl font-bold text-gray-900">Activity Explorer</h1> */}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Plus size={18} />
                <span>Add Activities</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filter Controls */}
        <div className="mb-8">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            {/* Search Bar */}
            <div className="relative max-w-md flex-1">
              <Search
                className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 shadow-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 rounded-lg px-4 py-3 font-medium transition-colors ${
                  showFilters
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter size={18} />
                <span>Filters</span>
                {getTotalActiveFilters() > 0 && (
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    {getTotalActiveFilters()}
                  </span>
                )}
              </button>

              {getTotalActiveFilters() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 rounded-xl border bg-white p-6 shadow-lg">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Object.entries(filters).map(([filterType, options]) => (
                  <div key={filterType}>
                    <h3 className="mb-3 font-semibold text-gray-900 capitalize">
                      {filterType.replace('_', ' ')}
                    </h3>
                    <div className="max-h-40 space-y-2 overflow-y-auto">
                      {options.map((option) => {
                        const isSelected =
                          selectedFilters[filterType]?.includes(option.value) || false;
                        return (
                          <label
                            key={option.value}
                            className="flex cursor-pointer items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) =>
                                handleFilterChange(filterType, option.value, e.target.checked)
                              }
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredActivities.length}</span>{' '}
            activities
            {searchTerm && (
              <span>
                {' '}
                matching "<span className="font-medium">{searchTerm}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-200 hover:shadow-lg"
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    {editingActivity === activity.id ? (
                      <div className="space-y-4">
                        {/* Title and Description */}
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            placeholder="Activity title"
                          />
                          <textarea
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({ ...editForm, description: e.target.value })
                            }
                            className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Activity description"
                          />
                        </div>

                        {/* Tags Section */}
                        <div className="border-t pt-4">
                          <h4 className="mb-3 text-sm font-medium text-gray-900">Tags</h4>
                          <div className="grid max-h-64 grid-cols-2 gap-4 overflow-y-auto">
                            {/* Themes */}
                            {filters.themes && (
                              <TagCheckboxGroup
                                tagCategory="themes"
                                options={filters.themes}
                                selectedValues={editForm.themes}
                                onChange={handleTagChange}
                              />
                            )}

                            {/* Types */}
                            {filters.types && (
                              <TagCheckboxGroup
                                tagCategory="types"
                                options={filters.types}
                                selectedValues={editForm.activity_types}
                                onChange={handleTagChange}
                              />
                            )}

                            {/* Locations */}
                            {filters.locations && (
                              <TagCheckboxGroup
                                tagCategory="locations"
                                options={filters.locations}
                                selectedValues={editForm.locations}
                                onChange={handleTagChange}
                              />
                            )}

                            {/* Costs */}
                            {filters.costs && (
                              <TagCheckboxGroup
                                tagCategory="costs"
                                options={filters.costs}
                                selectedValues={editForm.costs}
                                onChange={handleTagChange}
                              />
                            )}

                            {/* Durations */}
                            {filters.durations && (
                              <TagCheckboxGroup
                                tagCategory="durations"
                                options={filters.durations}
                                selectedValues={editForm.durations}
                                onChange={handleTagChange}
                              />
                            )}

                            {/* Participants */}
                            {filters.participants && (
                              <TagCheckboxGroup
                                tagCategory="participants"
                                options={filters.participants}
                                selectedValues={editForm.participants}
                                onChange={handleTagChange}
                              />
                            )}

                            {/* Seasons */}
                            {filters.seasons && (
                              <TagCheckboxGroup
                                tagCategory="seasons"
                                options={filters.seasons}
                                selectedValues={editForm.seasons}
                                onChange={handleTagChange}
                              />
                            )}

                            {/* Age Groups */}
                            {filters.age_groups && (
                              <TagCheckboxGroup
                                tagCategory="age_groups"
                                options={filters.age_groups}
                                selectedValues={editForm.age_groups}
                                onChange={handleTagChange}
                              />
                            )}

                            {/* Frequency */}
                            {filters.frequency && (
                              <TagCheckboxGroup
                                tagCategory="frequency"
                                options={filters.frequency}
                                selectedValues={editForm.frequency}
                                onChange={handleTagChange}
                              />
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 border-t pt-3">
                          <button
                            onClick={saveEdit}
                            className="flex items-center space-x-1 rounded-md bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
                          >
                            <Check size={14} />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center space-x-1 rounded-md bg-gray-500 px-3 py-1 text-sm text-white transition-colors hover:bg-gray-600"
                          >
                            <X size={14} />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                          {activity.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Assigned to: <span className="font-medium">Family</span>
                        </p>
                      </>
                    )}
                  </div>

                  {editingActivity !== activity.id && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEdit(activity)}
                        className="p-1 text-gray-400 transition-colors hover:text-blue-600"
                        title="Edit activity"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deleteActivity(activity.id)}
                        className="p-1 text-gray-400 transition-colors hover:text-red-600"
                        title="Delete activity"
                      >
                        <Trash2 size={16} />
                      </button>
                      {/* <button
                        onClick={() => toggleActivity(activity.id)}
                        className="text-2xl transition-transform hover:scale-110"
                        title={activity.done ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {activity.done ? '✅' : '⬜️'}
                      </button> */}
                    </div>
                  )}
                </div>

                {editingActivity !== activity.id && (
                  <>
                    <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                      {activity.description}
                    </p>

                    {/* Quick Info Icons */}
                    <div className="mb-4 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{getFilterLabel('durations', activity.durations?.[0])}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span>{formatParticipants(activity.participants ?? undefined)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{getFilterLabel('locations', activity.locations?.[0])}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      {/* Themes */}
                      {activity.themes?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {activity.themes.slice(0, 2).map((theme) => (
                            <span
                              key={theme}
                              className={`rounded-full px-2 py-1 text-xs font-medium ${getTagColor('themes')}`}
                            >
                              {getFilterLabel('themes', theme)}
                            </span>
                          ))}
                          {activity.themes.length > 2 && (
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                              +{activity.themes.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : null}

                      {/* Activity Types */}
                      {activity.activity_types?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {activity.activity_types.slice(0, 2).map((type) => (
                            <span
                              key={type}
                              className={`rounded-full px-2 py-1 text-xs font-medium ${getTagColor('activity_types')}`}
                            >
                              {getFilterLabel('activity_types', type)}
                            </span>
                          ))}
                          {activity.activity_types.length > 2 && (
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                              +{activity.activity_types.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </>
                )}
              </div>

              {/* Card Actions */}
              {editingActivity !== activity.id && (
                <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {activity.costs?.length && (
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          activity.costs.includes('free' as Cost)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {formatCost(activity.costs)}
                      </span>
                    )}
                    {activity.age_groups?.length && (
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {formatAgeGroups(activity.age_groups)}
                      </span>
                    )}
                    {activity.seasons?.length && (
                      <div className="rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                        <span>{formatSeasons(activity.seasons)}</span>
                      </div>
                    )}
                  </div>
                  {activity.activity_scale && (
                    <div className="rounded bg-pink-100 px-2 py-1 text-xs font-medium text-pink-800">
                      <span>{formatActivityScale(activity.activity_scale)}</span>
                    </div>
                  )}
                  {/* <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                    View Details
                  </button> */}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="py-16 text-center">
            <div className="mb-4">
              <Search className="mx-auto text-gray-400" size={64} />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No activities found</h3>
            <p className="mb-6 text-gray-600">
              Try adjusting your search terms or filters to find more activities.
            </p>
            <button
              onClick={clearAllFilters}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Activities</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Describe your activity idea
              </label>
              <textarea
                value={newActivityText}
                onChange={(e) => setNewActivityText(e.target.value)}
                placeholder="e.g., Make homemade pizza with the kids on a rainy Sunday afternoon, or Set up an outdoor obstacle course in the backyard for summer fun"
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <p className="mt-2 text-sm text-gray-500">
                Just describe your idea in natural language. Our AI will automatically organize it
                and add appropriate tags!
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 border-t bg-gray-50 p-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={addActivities}
                disabled={!newActivityText.trim() || addingActivity}
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {addingActivity ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Add Activities</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
