import { useEffect, useState, useMemo } from 'react';
import { Search, Filter, Plus, Clock, Users, MapPin } from 'lucide-react';
import { ActivitiesService, type ActivityResponse, type Duration, type Participants, type Cost, type Frequency, type Season, type AgeGroup } from '@/generated-api';


// // Mock data for demonstration - in real app, this would come from your API
// const mockFilters = {
//   costs: [
//     { value: 'free', label: 'Free' },
//     { value: 'low', label: '$' },
//     { value: 'medium', label: '$$' },
//     { value: 'high', label: '$$$' }
//   ],
//   durations: [
//     { value: 'short', label: 'Short' },
//     { value: 'medium', label: 'Medium' },
//     { value: 'long', label: 'Long' },
//     { value: 'full_day', label: 'Full Day' },
//     { value: 'multi_day', label: 'Multi-Day' }
//   ],
//   participants: [
//     { value: 'solo', label: 'Solo' },
//     { value: 'two_player', label: '2 Players' },
//     { value: 'small_group', label: '3–5' },
//     { value: 'medium_group', label: '6–10' },
//     { value: 'large_group', label: '10+' },
//     { value: 'family', label: 'Family' }
//   ],
//   locations: [
//     { value: 'home_indoor', label: 'Home Indoor' },
//     { value: 'home_outdoor', label: 'Home Outdoor' },
//     { value: 'local', label: 'Local' },
//     { value: 'regional', label: 'Regional' },
//     { value: 'travel', label: 'Travel' }
//   ],
//   seasons: [
//     { value: 'all', label: 'All Seasons' },
//     { value: 'spring', label: 'Spring' },
//     { value: 'summer', label: 'Summer' },
//     { value: 'fall', label: 'Fall' },
//     { value: 'winter', label: 'Winter' },
//     { value: 'rainy_day', label: 'Rainy Day' },
//     { value: 'snowy_day', label: 'Snowy Day' }
//   ],
//   age_groups: [
//     { value: 'toddler', label: 'Toddler' },
//     { value: 'child', label: 'Child' },
//     { value: 'tween', label: 'Tween' },
//     { value: 'teen', label: 'Teen' },
//     { value: 'adult', label: 'Adult' },
//     { value: 'family', label: 'Family' }
//   ],
//   themes: [
//     { value: 'adventure', label: '🌋 Adventure' },
//     { value: 'creative', label: '🎨 Creative / Arts' },
//     { value: 'educational', label: '📚 Educational' },
//     { value: 'fitness', label: '💪 Fitness & Sports' },
//     { value: 'food_drink', label: '🍴 Food & Drink' },
//     { value: 'festive', label: '🎉 Festive / Celebration' },
//     { value: 'mindfulness', label: '🧘 Mindfulness' },
//     { value: 'nature', label: '🌿 Nature' },
//     { value: 'relaxation', label: '🛋️ Relaxation' },
//     { value: 'social', label: '🤝 Social' }
//   ],
//   activity_types: [
//     { value: 'amusement_park', label: '🎢 Amusement Park' },
//     { value: 'arts_crafts', label: '🎨 Creative / Arts' },
//     { value: 'board_games', label: '🎲 Board Games' },
//     { value: 'classes', label: '📚 Classes / Workshops' },
//     { value: 'dance', label: '💃 Dance / Movement' },
//     { value: 'festival', label: '🎪 Festival / Fair' },
//     { value: 'games', label: '🎲 Games' },
//     { value: 'gardening', label: '🌱 Gardening' },
//     { value: 'hiking', label: '🥾 Hiking' },
//     { value: 'indoor', label: '🏠 Indoor Fun' },
//     { value: 'music', label: '🎶 Music' },
//     { value: 'outdoor', label: '🌳 Outdoor Fun' },
//     { value: 'park', label: '🏞️ Park Visit' },
//     { value: 'puzzles', label: '🧩 Puzzles & Brain Games' },
//     { value: 'science_tech', label: '🔬 Science & Tech' },
//     { value: 'storytelling', label: '📖 Storytelling / Reading' },
//     { value: 'travel', label: '✈️ Trips & Excursions' },
//     { value: 'video_games', label: '🎮 Video Games' },
//     { value: 'volunteering', label: '🤝 Volunteering' },
//     { value: 'sports', label: '🏀 Sports' },
//     { value: 'zoo_aquarium', label: '🦁 Zoo / Aquarium' }
//   ]
// };

// // Mock activities data
// const mockActivities = [
//   {
//     id: 1,
//     title: "Nature Scavenger Hunt",
//     description: "Create a list of items to find outdoors and explore your local park or backyard",
//     done: false,
//     assignee_name: "Emma",
//     costs: ['free'],
//     durations: ['medium'],
//     participants: ['family'],
//     locations: ['local'],
//     seasons: ['spring', 'summer', 'fall'],
//     age_groups: ['child', 'tween'],
//     themes: ['nature', 'adventure'],
//     types: ['outdoor', 'park']
//   },
//   {
//     id: 2,
//     title: "DIY Science Volcano",
//     description: "Build and erupt a volcano using baking soda, vinegar, and food coloring",
//     done: true,
//     assignee_name: "Alex",
//     costs: ['low'],
//     durations: ['short'],
//     participants: ['family'],
//     locations: ['home_outdoor'],
//     seasons: ['all'],
//     age_groups: ['child', 'tween'],
//     themes: ['educational', 'creative'],
//     types: ['science_tech']
//   },
//   {
//     id: 3,
//     title: "Family Game Night",
//     description: "Set up a rotating tournament of board games with snacks and prizes",
//     done: false,
//     assignee_name: "Family",
//     costs: ['free'],
//     durations: ['long'],
//     participants: ['family'],
//     locations: ['home_indoor'],
//     seasons: ['all'],
//     age_groups: ['family'],
//     themes: ['social', 'relaxation'],
//     types: ['board_games', 'games']
//   },
//   {
//     id: 4,
//     title: "Cooking Adventure: Pizza Making",
//     description: "Make homemade pizza from scratch with custom toppings for everyone",
//     done: false,
//     assignee_name: "Family",
//     costs: ['medium'],
//     durations: ['medium'],
//     participants: ['family'],
//     locations: ['home_indoor'],
//     seasons: ['all'],
//     age_groups: ['child', 'tween', 'teen'],
//     themes: ['food_drink', 'creative'],
//     types: ['indoor']
//   },
//   {
//     id: 5,
//     title: "Backyard Obstacle Course",
//     description: "Design and build an obstacle course using household items and yard materials",
//     done: false,
//     assignee_name: "Jordan",
//     costs: ['free'],
//     durations: ['long'],
//     participants: ['small_group'],
//     locations: ['home_outdoor'],
//     seasons: ['spring', 'summer', 'fall'],
//     age_groups: ['child', 'tween'],
//     themes: ['fitness', 'adventure'],
//     types: ['outdoor']
//   },
//   {
//     id: 6,
//     title: "Art Gallery at Home",
//     description: "Create artwork and set up a mini gallery with opening night celebration",
//     done: false,
//     assignee_name: "Emma",
//     costs: ['low'],
//     durations: ['full_day'],
//     participants: ['family'],
//     locations: ['home_indoor'],
//     seasons: ['all'],
//     age_groups: ['child', 'tween'],
//     themes: ['creative', 'festive'],
//     types: ['arts_crafts']
//   }
// ];
type TagCategory =
  | 'themes'
  | 'types'
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

export default function ActivitiesBrowser() {
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [filters, setFilters] = useState<Record<string, { value: string; label: string }[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedFilters, fetchedActivities] = await Promise.all([
          ActivitiesService.getActivityFiltersApiV1ActivitiesFiltersGet(),
          ActivitiesService.getActivitiesApiV1ActivitiesGet({})
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
    return activities.filter((activity: any) => {
      if (
        searchTerm &&
        !activity.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !activity.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      for (const [filterType, selectedValues] of Object.entries(selectedFilters)) {
        if (selectedValues.length > 0) {
          const activityValues = activity[filterType] || [];
          const hasMatch = selectedValues.some((value) => activityValues.includes(value));
          if (!hasMatch) return false;
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
      const updated = await ActivitiesService.toggleActivityApiV1ActivitiesActivityIdTogglePost({ activityId });
      setActivities((prev) => prev.map((a) => (a.id === activityId ? updated : a)));
    } catch (err) {
      console.error('Failed to toggle activity:', err);
    }
  };

  const getTagColor = (type: TagCategory) => {
    const colorMap: Record<TagCategory, string> = {
      themes: 'bg-purple-100 text-purple-800',
      types: 'bg-blue-100 text-blue-800',
      locations: 'bg-green-100 text-green-800',
      costs: 'bg-yellow-100 text-yellow-800',
      durations: 'bg-indigo-100 text-indigo-800',
      participants: 'bg-pink-100 text-pink-800',
      seasons: 'bg-orange-100 text-orange-800',
      age_groups: 'bg-teal-100 text-teal-800',
      frequency: 'bg-red-100 text-red-800'
    };
  
    return colorMap[type];
  };

  const getFilterLabel = (
    type: keyof typeof filters,
    value?: FilterValue
  ): string => {
    if (!value) return '';
    return filters[type]?.find(f => f.value === String(value))?.label ?? String(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()} 
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Activity Explorer</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus size={18} />
                <span>Add Activity</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Controls */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  showFilters ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter size={18} />
                <span>Filters</span>
                {getTotalActiveFilters() > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {getTotalActiveFilters()}
                  </span>
                )}
              </button>
              
              {getTotalActiveFilters() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 bg-white rounded-xl shadow-lg border p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.entries(filters).map(([filterType, options]) => (
                  <div key={filterType}>
                    <h3 className="font-semibold text-gray-900 mb-3 capitalize">
                      {filterType.replace('_', ' ')}
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {options.map(option => {
                        const isSelected = selectedFilters[filterType]?.includes(option.value) || false;
                        return (
                          <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleFilterChange(filterType, option.value, e.target.checked)}
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
            Showing <span className="font-semibold text-gray-900">{filteredActivities.length}</span> activities
            {searchTerm && <span> matching "<span className="font-medium">{searchTerm}</span>"</span>}
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map(activity => (
            <div key={activity.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden group">
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {activity.title}
                    </h3>
                    {/* <p className="text-sm text-gray-500 mt-1">
                      Assigned to: <span className="font-medium">{activity.assignee_name}</span>
                    </p> */}
                    <p className="text-sm text-gray-500 mt-1">
                      Assigned to: <span className="font-medium">Family</span>
                    </p>
                  </div>
                  <button
                    onClick={() => toggleActivity(activity.id)}
                    className="text-2xl hover:scale-110 transition-transform"
                    title={activity.done ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {activity.done ? '✅' : '⬜️'}
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {activity.description}
                </p>

                {/* Quick Info Icons */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{getFilterLabel('durations', activity.durations?.[0])}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={14} />
                    <span>{getFilterLabel('participants', activity.participants?.[0])}</span>
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
                      {activity.themes.slice(0, 2).map(theme => (
                        <span
                          key={theme}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getTagColor('themes')}`}
                        >
                          {getFilterLabel('themes', theme)}
                        </span>
                      ))}
                      {activity.themes.length > 2 && (
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-600">
                          +{activity.themes.length - 2} more
                        </span>
                      )}
                    </div>
                  ) : null}

                  {/* Activity Types */}
                  {activity.types?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {activity.types.slice(0, 2).map(type => (
                        <span
                          key={type}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getTagColor('types')}`}
                        >
                          {getFilterLabel('activity_types', type)}
                        </span>
                      ))}
                      {activity.types.length > 2 && (
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-600">
                          +{activity.types.length - 2} more
                        </span>
                      )}
                    </div>
                  ) : null}

                </div>
              </div>

              {/* Card Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {activity.costs?.includes('free' as unknown as Cost) && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                      FREE
                    </span>
                  )}
                  {activity.age_groups?.slice(0, 1).map(age => (
                    <span key={String(age)} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                      {getFilterLabel('age_groups', age)}
                    </span>
                  ))}
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-4">
              <Search className="mx-auto text-gray-400" size={64} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find more activities.
            </p>
            <button
              onClick={clearAllFilters}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}