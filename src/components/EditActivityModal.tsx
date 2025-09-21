import React, { useState } from 'react';
import {
  X,
  Save,
  ChevronDown,
  ChevronRight,
  Palette,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Calendar,
  Target,
  Zap,
} from 'lucide-react';
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
  ActivityScale,
} from '@/generated-api';
import ChecklistGenerator from '@/components/ChecklistGenerator';

export interface EditForm {
  title: string;
  description: string;
  themes: Theme[];
  activity_types: ActivityType[];
  locations: Location[];
  costs: Cost[];
  durations: Duration[];
  participants: Participants[];
  seasons: Season[];
  age_groups: AgeGroup[];
  frequency: Frequency[];
  activity_scale?: ActivityScale | undefined;
  equipment?: string[];
  instructions?: string[];
  adhd_tips?: string[];
}

interface EditActivityModalProps {
  activity: ActivityResponse;
  editForm: EditForm;
  setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
  filters: Record<string, { value: string; label: string }[]>;
  onSave: () => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
  setActivities: React.Dispatch<React.SetStateAction<ActivityResponse[]>>;
  setEditingActivity: React.Dispatch<React.SetStateAction<ActivityResponse | null>>;
}

const categoryIcons = {
  themes: Palette,
  activity_types: Zap,
  locations: MapPin,
  participants: Users,
  durations: Clock,
  costs: DollarSign,
  seasons: Calendar,
  age_groups: Target,
  frequency: Target,
};

const categoryColors = {
  themes: 'bg-purple-50 border-purple-200 text-purple-700',
  activity_types: 'bg-blue-50 border-blue-200 text-blue-700',
  locations: 'bg-green-50 border-green-200 text-green-700',
  participants: 'bg-pink-50 border-pink-200 text-pink-700',
  durations: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  costs: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  seasons: 'bg-orange-50 border-orange-200 text-orange-700',
  age_groups: 'bg-teal-50 border-teal-200 text-teal-700',
  frequency: 'bg-red-50 border-red-200 text-red-700',
};

const scaleOptions: { value: ActivityScale; label: string; description: string }[] = [
  { value: ActivityScale.SMALL, label: 'Small', description: 'Simple, quick setup' },
  { value: ActivityScale.MEDIUM, label: 'Medium', description: 'Moderate preparation' },
  { value: ActivityScale.LARGE, label: 'Large', description: 'Significant planning' },
  { value: ActivityScale.EXTRA_LARGE, label: 'Extra Large', description: 'Major event/project' },
];

const categoryTitles = {
  themes: 'Themes',
  activity_types: 'Activity Types',
  locations: 'Locations',
  participants: 'Participants',
  durations: 'Duration',
  costs: 'Cost Range',
  seasons: 'Seasons',
  age_groups: 'Age Groups',
  frequency: 'Frequency',
};

export default function EditActivityModal({
  activity,
  editForm,
  setEditForm,
  filters,
  onSave,
  onCancel,
  isSaving,
  setActivities,
  setEditingActivity,
}: EditActivityModalProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    scale: false,
    themes: true,
    activity_types: false,
    locations: false,
    participants: false,
    durations: false,
    costs: false,
    seasons: false,
    age_groups: false,
    frequency: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleTagToggle = (category: keyof EditForm, value: string) => {
    setEditForm((prev) => {
      const currentValues = (prev[category] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [category]: newValues,
      };
    });
  };

  const handleScaleChange = (scale: ActivityScale) => {
    setEditForm((prev) => ({
      ...prev,
      activity_scale: prev.activity_scale === scale ? undefined : scale,
    }));
  };

  const handleActivityUpdate = (updatedActivity: ActivityResponse) => {
    setEditForm((prev) => ({
      ...prev,
      equipment: updatedActivity.equipment || [],
      instructions: updatedActivity.instructions || [],
      adhd_tips: updatedActivity.adhd_tips || [],
    }));

    setActivities((prev) =>
      prev.map((act) => (act.id === updatedActivity.id ? updatedActivity : act))
    );

    setEditingActivity(updatedActivity);
  };

  const CategorySection = ({ category }: { category: keyof typeof categoryIcons }) => {
    const Icon = categoryIcons[category];
    const colorClass = categoryColors[category];
    const selectedValues = (editForm[category] as string[]) || [];
    const options = filters[category] || [];
    const title = categoryTitles[category];

    if (!options.length) return null;

    return (
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <button
          onClick={() => toggleSection(category)}
          className={`flex w-full items-center justify-between bg-gradient-to-r from-gray-50 to-white px-6 py-4 transition-all duration-200 hover:from-gray-100 hover:to-gray-50 ${expandedSections[category] ? 'border-b border-gray-200' : ''}`}
        >
          <div className="flex items-center space-x-3">
            <div className={`rounded-lg p-2 ${colorClass}`}>
              <Icon size={18} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{selectedValues.length} selected</p>
            </div>
          </div>
          {expandedSections[category] ? (
            <ChevronDown size={20} className="text-gray-400" />
          ) : (
            <ChevronRight size={20} className="text-gray-400" />
          )}
        </button>

        {expandedSections[category] && (
          <div className="bg-white p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleTagToggle(category, option.value)}
                    className={`group relative rounded-lg border-2 p-3 text-left transition-all duration-200 ${
                      isSelected
                        ? `${colorClass} scale-[1.02] border-current shadow-md`
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                          isSelected
                            ? 'border-current'
                            : 'border-gray-300 group-hover:border-gray-400'
                        }`}
                      >
                        {isSelected && <div className="h-2 w-2 rounded-full bg-current"></div>}
                      </div>
                      <span
                        className={`font-medium ${
                          isSelected ? 'text-current' : 'text-gray-700 group-hover:text-gray-900'
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-current">
                        <div className="h-1 w-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between rounded-t-2xl border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Activity</h2>
            <p className="mt-1 text-sm text-gray-600">Customize your activity details and tags</p>
          </div>
          <button onClick={onCancel} className="rounded-lg p-2 transition-colors hover:bg-white/70">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <span className="text-sm font-bold text-blue-600">1</span>
              </div>
              <span>Basic Information</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Activity Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter activity title..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your activity..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Activity Scale */}
          <div className="space-y-4">
            <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                <span className="text-sm font-bold text-green-600">2</span>
              </div>
              <span>Activity Scale</span>
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {scaleOptions.map((scale) => {
                const isSelected = editForm.activity_scale === scale.value;
                return (
                  <button
                    key={scale.value}
                    onClick={() => handleScaleChange(scale.value)}
                    className={`group rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? 'scale-[1.02] border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h4
                        className={`font-semibold ${
                          isSelected ? 'text-blue-900' : 'text-gray-900 group-hover:text-blue-600'
                        }`}
                      >
                        {scale.label}
                      </h4>
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 group-hover:border-blue-300'
                        }`}
                      >
                        {isSelected && <div className="h-2 w-2 rounded-full bg-white"></div>}
                      </div>
                    </div>
                    <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                      {scale.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity Categories */}
          <div className="space-y-4">
            <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                <span className="text-sm font-bold text-purple-600">3</span>
              </div>
              <span>Activity Tags</span>
            </h3>

            <div className="space-y-4">
              <CategorySection category="themes" />
              <CategorySection category="activity_types" />
              <CategorySection category="locations" />

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <CategorySection category="costs" />
                <CategorySection category="durations" />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <CategorySection category="participants" />
                <CategorySection category="seasons" />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <CategorySection category="age_groups" />
                <CategorySection category="frequency" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                <span className="text-sm font-bold text-orange-600">4</span>
              </div>
              <span>Activity Checklist</span>
            </h3>

            <ChecklistGenerator activity={activity} onActivityUpdate={handleActivityUpdate} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-end space-x-3 rounded-b-2xl border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
