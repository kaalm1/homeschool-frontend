import { useState, useMemo } from 'react';
import type { ActivityResponse } from '@/generated-api';

export type FilterValue = {
  label: string;
  value: string;
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

// Helper function to check if activity matches filter
export function hasFilterMatch(
  activity: ActivityResponse,
  filterType: TagCategory,
  selectedValues: string[]
): boolean {
  const activityValue = activity[filterType];

  if (!activityValue) return false;

  if (Array.isArray(activityValue)) {
    return selectedValues.some((value) => activityValue.includes(value));
  }

  if (typeof activityValue === 'string') {
    return selectedValues.includes(activityValue);
  }

  return false;
}

// Extract filters from activities
export function extractFiltersFromActivities(activities: ActivityResponse[]): ActivityFilters {
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

  const uniqueValues: { [key: string]: Set<string> } = {
    themes: new Set(),
    activity_types: new Set(),
    age_groups: new Set(),
    locations: new Set(),
    seasons: new Set(),
    participants: new Set(),
    costs: new Set(),
    durations: new Set(),
  };

  activities.forEach((activity) => {
    Object.keys(filters).forEach((filterType) => {
      const value = activity[filterType as keyof ActivityResponse];

      if (Array.isArray(value)) {
        value.forEach((item) => uniqueValues[filterType].add(item));
      } else if (typeof value === 'string' && value.trim()) {
        uniqueValues[filterType].add(value);
      }
    });
  });

  // Convert sets to FilterValue arrays
  Object.keys(filters).forEach((filterType) => {
    filters[filterType] = Array.from(uniqueValues[filterType])
      .sort()
      .map((value) => ({ label: value, value }));
  });

  return filters;
}

// Filter activities based on search and selected filters
export function useActivityFiltering(
  activities: ActivityResponse[],
  searchTerm: string,
  selectedFilters: SelectedFilters
) {
  return useMemo(() => {
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
}

// Search Bar Component
interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

export function SearchBar({
  searchTerm,
  onSearchChange,
  placeholder = 'Search activities...',
}: SearchBarProps) {
  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}

// Filter Toggle Button Component
interface FilterToggleProps {
  showFilters: boolean;
  onToggle: () => void;
  activeFiltersCount: number;
  onClearAll: () => void;
}

export function FilterToggle({
  showFilters,
  onToggle,
  activeFiltersCount,
  onClearAll,
}: FilterToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onToggle}
        className={`flex items-center space-x-2 rounded-lg px-4 py-2 font-medium transition-colors ${
          showFilters
            ? 'bg-blue-600 text-white'
            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {activeFiltersCount > 0 && (
        <button onClick={onClearAll} className="text-sm text-blue-600 hover:text-blue-800">
          Clear all
        </button>
      )}
    </div>
  );
}

// Filter Panel Component
interface FilterPanelProps {
  filters: ActivityFilters;
  selectedFilters: SelectedFilters;
  onFilterChange: (filterType: string, value: string, checked: boolean) => void;
  showFilters: boolean;
}

export function FilterPanel({
  filters,
  selectedFilters,
  onFilterChange,
  showFilters,
}: FilterPanelProps) {
  if (!showFilters) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(filters).map(([filterType, options]) => {
          if (!options.length) return null;

          return (
            <div key={filterType}>
              <h4 className="mb-2 font-medium text-gray-900 capitalize">
                {filterType.replace('_', ' ')}
              </h4>
              <div className="max-h-32 space-y-2 overflow-y-auto">
                {options.map((option) => {
                  const isSelected = selectedFilters[filterType]?.includes(option.value) || false;
                  return (
                    <label key={option.value} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onFilterChange(filterType, option.value, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Results Summary Component
interface ResultsSummaryProps {
  totalResults: number;
  searchTerm: string;
}

export function ResultsSummary({ totalResults, searchTerm }: ResultsSummaryProps) {
  return (
    <div className="text-sm text-gray-600">
      Showing {totalResults} activities
      {searchTerm && (
        <span>
          {' '}
          matching "<span className="font-medium">{searchTerm}</span>"
        </span>
      )}
    </div>
  );
}
