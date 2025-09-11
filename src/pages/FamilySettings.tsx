import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Calendar,
  MapPin,
  Heart,
  Clock,
  Users,
  Star,
  Save,
  ArrowLeft,
  Plus,
  X,
} from 'lucide-react';

// Mock data structure based on your models
interface Kid {
  id: number;
  name: string;
  dob: string;
  age?: number;
  interests: string[];
  special_needs: string[];
  color: string;
}

interface FamilyPreferences {
  preferred_themes: string[];
  preferred_activity_types: string[];
  available_days: string[];
  preferred_time_slots: string[];
  group_activity_comfort: string;
  new_experience_openness: string;
  educational_priorities: string[];
}

const THEME_OPTIONS = [
  'outdoor-adventure',
  'arts-crafts',
  'science-discovery',
  'sports-fitness',
  'cooking-baking',
  'music-dance',
  'reading-storytelling',
  'building-making',
];

const ACTIVITY_TYPE_OPTIONS = [
  'physical-active',
  'creative-artistic',
  'educational-learning',
  'social-group',
  'quiet-focused',
  'messy-sensory',
  'competitive-games',
  'free-play',
];

const DAY_OPTIONS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const TIME_SLOT_OPTIONS = ['early-morning', 'morning', 'afternoon', 'evening', 'weekend-flexible'];

const EDUCATIONAL_PRIORITIES = [
  'stem',
  'arts',
  'social-skills',
  'physical-development',
  'creativity',
  'independence',
];

export default function FamilySettings() {
  const [kids, setKids] = useState<Kid[]>([
    {
      id: 1,
      name: 'Emma',
      dob: '2018-05-15',
      age: 6,
      interests: ['art', 'music'],
      special_needs: [],
      color: '#a7f3d0',
    },
    {
      id: 2,
      name: 'Alex',
      dob: '2020-08-22',
      age: 4,
      interests: ['sports', 'building'],
      special_needs: [],
      color: '#fbbf24',
    },
  ]);

  const [preferences, setPreferences] = useState<FamilyPreferences>({
    preferred_themes: ['outdoor-adventure', 'arts-crafts'],
    preferred_activity_types: ['creative-artistic', 'physical-active'],
    available_days: ['saturday', 'sunday'],
    preferred_time_slots: ['morning', 'afternoon'],
    group_activity_comfort: 'medium',
    new_experience_openness: 'medium',
    educational_priorities: ['creativity', 'physical-development'],
  });

  const [activeTab, setActiveTab] = useState('kids');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    // Show success message or redirect
  };

  const updateKidInterest = (kidId: number, interest: string, add: boolean) => {
    setKids((prev) =>
      prev.map((kid) => {
        if (kid.id === kidId) {
          const interests = add
            ? [...kid.interests, interest]
            : kid.interests.filter((i) => i !== interest);
          return { ...kid, interests };
        }
        return kid;
      })
    );
  };

  const updatePreferenceArray = (field: keyof FamilyPreferences, value: string, add: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: add
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter((item) => item !== value),
    }));
  };

  const updatePreferenceValue = (field: keyof FamilyPreferences, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const MultiSelectCard = ({
    title,
    options,
    selected,
    field,
    icon: Icon,
    maxSelect = undefined,
  }: {
    title: string;
    options: { value: string; label: string; description?: string }[];
    selected: string[];
    field: keyof FamilyPreferences;
    icon: any;
    maxSelect?: number;
  }) => (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">{title}</h3>
        {maxSelect && <span className="text-sm text-gray-500">(select up to {maxSelect})</span>}
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          const canSelect = !maxSelect || selected.length < maxSelect || isSelected;

          return (
            <button
              key={option.value}
              onClick={() => canSelect && updatePreferenceArray(field, option.value, !isSelected)}
              disabled={!canSelect}
              className={`rounded-lg border p-3 text-left transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : canSelect
                    ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    : 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400'
              } `}
            >
              <div className="text-sm font-medium">{option.label}</div>
              {option.description && (
                <div className="mt-1 text-xs text-gray-600">{option.description}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const RadioCard = ({
    title,
    options,
    selected,
    field,
    icon: Icon,
  }: {
    title: string;
    options: { value: string; label: string; description?: string }[];
    selected: string;
    field: keyof FamilyPreferences;
    icon: any;
  }) => (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => updatePreferenceValue(field, option.value)}
            className={`w-full rounded-lg border p-3 text-left transition-all ${
              selected === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } `}
          >
            <div className="text-sm font-medium">{option.label}</div>
            {option.description && (
              <div className="mt-1 text-xs text-gray-600">{option.description}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="rounded-md p-1 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold">Family Settings</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 rounded-lg border bg-white p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('kids')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'kids'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              } `}
            >
              Kids & Interests
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'preferences'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              } `}
            >
              Activity Preferences
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'schedule'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              } `}
            >
              Schedule & Comfort
            </button>
          </nav>
        </div>

        {/* Kids Tab */}
        {activeTab === 'kids' && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Your Kids</h2>
                </div>
                <button className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700">
                  <Plus className="h-4 w-4" />
                  Add Kid
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {kids.map((kid) => (
                  <div
                    key={kid.id}
                    className="rounded-lg border p-4"
                    style={{ borderColor: kid.color }}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white"
                          style={{ backgroundColor: kid.color }}
                        >
                          {kid.name[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold">{kid.name}</h3>
                          <p className="text-sm text-gray-600">Age {kid.age}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 flex items-center gap-2 font-medium">
                        <Heart className="h-4 w-4" />
                        Interests
                      </h4>
                      <div className="mb-3 flex flex-wrap gap-2">
                        {kid.interests.map((interest) => (
                          <span
                            key={interest}
                            className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                          >
                            {interest}
                            <button
                              onClick={() => updateKidInterest(kid.id, interest, false)}
                              className="hover:text-blue-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <input
                        type="text"
                        placeholder="Add new interest and press Enter"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            updateKidInterest(kid.id, e.currentTarget.value.trim(), true);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <MultiSelectCard
              title="Preferred Themes"
              options={THEME_OPTIONS.map((theme) => ({
                value: theme,
                label: theme.charAt(0).toUpperCase() + theme.slice(1),
              }))}
              selected={preferences.preferred_themes}
              field="preferred_themes"
              icon={Star}
              maxSelect={5}
            />

            <MultiSelectCard
              title="Preferred Activity Types"
              options={ACTIVITY_TYPE_OPTIONS.map((activity) => ({
                value: activity,
                label: activity.charAt(0).toUpperCase() + activity.slice(1),
              }))}
              selected={preferences.preferred_activity_types}
              field="preferred_activity_types"
              icon={Heart}
              maxSelect={6}
            />

            <MultiSelectCard
              title="Learning Priorities"
              options={[
                {
                  value: 'stem',
                  label: '🔬 STEM',
                  description: 'Science, technology, engineering, math',
                },
                {
                  value: 'arts',
                  label: '🎨 Arts',
                  description: 'Creative expression and artistic skills',
                },
                {
                  value: 'social-skills',
                  label: '🤝 Social Skills',
                  description: 'Communication and teamwork',
                },
                {
                  value: 'physical-development',
                  label: '🏃 Physical',
                  description: 'Motor skills and fitness',
                },
                {
                  value: 'creativity',
                  label: '💡 Creativity',
                  description: 'Innovation and imagination',
                },
                {
                  value: 'independence',
                  label: '🎯 Independence',
                  description: 'Self-reliance and confidence',
                },
              ]}
              selected={preferences.educational_priorities}
              field="educational_priorities"
              icon={Star}
              maxSelect={3}
            />
          </div>
        )}

        {/* Schedule & Comfort Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <MultiSelectCard
              title="Available Days"
              options={DAY_OPTIONS.map((day) => ({
                value: day,
                label: day.charAt(0).toUpperCase() + day.slice(1),
              }))}
              selected={preferences.available_days}
              field="available_days"
              icon={Calendar}
            />

            <MultiSelectCard
              title="Preferred Time Slots"
              options={TIME_SLOT_OPTIONS.map((slot) => ({
                value: slot,
                label: slot
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' '),
              }))}
              selected={preferences.preferred_time_slots}
              field="preferred_time_slots"
              icon={Clock}
            />

            <RadioCard
              title="Group Activity Comfort Level"
              options={[
                {
                  value: 'low',
                  label: 'Small Groups',
                  description: 'Prefer intimate, small group activities',
                },
                {
                  value: 'medium',
                  label: 'Medium Groups',
                  description: 'Comfortable with moderate-sized groups',
                },
                {
                  value: 'high',
                  label: 'Large Groups',
                  description: 'Enjoy big group activities and events',
                },
              ]}
              selected={preferences.group_activity_comfort}
              field="group_activity_comfort"
              icon={Users}
            />

            <RadioCard
              title="Openness to New Experiences"
              options={[
                {
                  value: 'conservative',
                  label: 'Stick to Favorites',
                  description: 'Prefer familiar activities and routines',
                },
                {
                  value: 'medium',
                  label: 'Mix of Both',
                  description: 'Balance of familiar and new experiences',
                },
                {
                  value: 'adventurous',
                  label: 'Love Trying New Things',
                  description: 'Always excited for new adventures',
                },
              ]}
              selected={preferences.new_experience_openness}
              field="new_experience_openness"
              icon={Star}
            />
          </div>
        )}
      </div>
    </div>
  );
}
