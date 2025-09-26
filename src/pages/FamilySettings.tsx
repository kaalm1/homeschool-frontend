import { Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
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
  Loader2,
  Edit,
  Trash2,
  Check,
  Home,
} from 'lucide-react';
import {
  SettingsService,
  FamilyPreferencesService,
  KidsService,
  UsersService,
} from '@/generated-api';
import type {
  AllSettingsResponse,
  EnumOption,
  FamilyPreferenceUpdateRequest,
  KidResponse,
  KidCreate,
  KidUpdate,
  UserUpdate,
  Theme,
  ActivityType,
  PreferredTimeSlot,
  DaysOfWeek,
  GroupActivityComfort,
  NewExperienceOpenness,
} from '@/generated-api';
import { Toaster, toast } from 'sonner';
import LocationInput from '@/components/LocationInput';
import AccountSettings from '@/components/FamilySettings/AccountSettings';

interface FamilyPreferences {
  preferred_themes: Theme[];
  preferred_activity_types: ActivityType[];
  available_days: DaysOfWeek[];
  preferred_time_slots: PreferredTimeSlot[];
  group_activity_comfort: GroupActivityComfort | undefined;
  new_experience_openness: NewExperienceOpenness | undefined;
  educational_priorities: string[];
}

interface FamilyProfile {
  location?: string;
  family_size?: number;
}

export default function FamilySettings() {
  const [kids, setKids] = useState<KidResponse[]>([]);
  const [preferences, setPreferences] = useState<FamilyPreferences>({
    preferred_themes: [],
    preferred_activity_types: [],
    available_days: [],
    preferred_time_slots: [],
    group_activity_comfort: undefined,
    new_experience_openness: undefined,
    educational_priorities: [],
  });

  const [familyProfile, setFamilyProfile] = useState<UserUpdate>({
    address: '',
    family_size: 1,
    max_activities_per_week: 10,
    has_car: true,
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API response data
  const [settingsOptions, setSettingsOptions] = useState<AllSettingsResponse | null>(null);

  // Edit states
  const [editingKid, setEditingKid] = useState<number | null>(null);
  const [addingKid, setAddingKid] = useState(false);
  const [newKid, setNewKid] = useState<KidCreate>({
    name: '',
    dob: '',
    interests: [],
    special_needs: [],
    color: '#a7f3d0',
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load settings options, preferences, and kids in parallel
        const [settingsResponse, preferencesResponse, kidsResponse, usersResponse] =
          await Promise.all([
            SettingsService.getAllSettingsApiV1SettingsSettingsAllGet(),
            FamilyPreferencesService.getFamilyPreferencesApiV1FamilyPreferencesApiV1FamilyPreferencesGet().catch(
              () => null
            ),
            KidsService.getKidsApiV1KidsGet().catch(() => []),
            UsersService.getUserProfileApiV1UserProfileGet().catch(() => null),
          ]);
        setSettingsOptions(settingsResponse);
        setKids(kidsResponse);

        if (preferencesResponse) {
          setPreferences({
            preferred_themes: preferencesResponse.preferred_themes || [],
            preferred_activity_types: preferencesResponse.preferred_activity_types || [],
            available_days: preferencesResponse.available_days || [],
            preferred_time_slots: preferencesResponse.preferred_time_slots || [],
            group_activity_comfort: preferencesResponse.group_activity_comfort || undefined,
            new_experience_openness: preferencesResponse.new_experience_openness || undefined,
            educational_priorities: preferencesResponse.educational_priorities || [],
          });
        }
        console.log(usersResponse);
        if (usersResponse) {
          setFamilyProfile({
            address: usersResponse.address || '',
            zipcode: usersResponse.zipcode || '',
            family_size: usersResponse.family_size || 1,
            max_activities_per_week: usersResponse.max_activities_per_week || 10,
            has_car: usersResponse.has_car ?? true,
          });
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleSave = async () => {
    const fullZipRegex = /^\d{5}(-\d{4})?$/;
    if (!familyProfile.zipcode || !fullZipRegex.test(familyProfile.zipcode)) {
      toast.error('Please enter a valid ZIP code before saving.');
      return;
    }
    setSaving(true);
    try {
      const updateRequest: FamilyPreferenceUpdateRequest = {
        ...preferences,
      };
      await FamilyPreferencesService.updateFamilyPreferencesApiV1FamilyPreferencesApiV1FamilyPreferencesPut(
        {
          requestBody: updateRequest,
        }
      );

      const profileUpdate: UserUpdate = {
        address: familyProfile.address,
        zipcode: familyProfile.zipcode,
        latitude: familyProfile.latitude,
        longitude: familyProfile.longitude,
        family_size: familyProfile.family_size,
        has_car: familyProfile.has_car,
        max_activities_per_week: familyProfile.max_activities_per_week,
      };
      await UsersService.updateCurrentUserProfileApiV1UserProfilePatch({
        requestBody: profileUpdate,
      });

      toast.success('Settings saved successfully!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateKid = async () => {
    try {
      const createdKid = await KidsService.createKidApiV1KidsPost({
        requestBody: newKid,
      });
      setKids((prev) => [...prev, createdKid]);
      setNewKid({
        name: '',
        dob: '',
        interests: [],
        special_needs: [],
        color: '#a7f3d0',
      });
      setAddingKid(false);
    } catch (err) {
      console.error('Failed to create kid:', err);
      toast.error('Failed to add kid. Please try again.');
    }
  };

  const handleUpdateKid = async (kidId: number, updates: KidUpdate) => {
    try {
      const updatedKid = await KidsService.updateKidApiV1KidsKidIdPatch({
        kidId,
        requestBody: updates,
      });

      setKids((prev) => prev.map((kid) => (kid.id === kidId ? updatedKid : kid)));
      setEditingKid(null);
    } catch (err) {
      console.error('Failed to update kid:', err);
      toast.error('Failed to update kid. Please try again.');
    }
  };

  const handleDeleteKid = async (kidId: number) => {
    toast('Are you sure you want to delete this kid?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await KidsService.deleteKidApiV1KidsKidIdDelete({ kidId });
            setKids((prev) => prev.filter((kid) => kid.id !== kidId));
            toast.success('Kid deleted successfully!');
          } catch (err) {
            console.error('Failed to delete kid:', err);
            toast.error('Failed to delete kid. Please try again.');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
      duration: 10000,
    });
  };

  const updateKidInterest = (kidId: number, interest: string, add: boolean) => {
    setKids((prev) =>
      prev.map((kid) => {
        if (kid.id === kidId) {
          const currentInterests = kid.interests ?? [];
          const interests = add
            ? [...currentInterests, interest]
            : currentInterests.filter((i) => i !== interest);
          return { ...kid, interests };
        }
        return kid;
      })
    );
  };

  const updateNewKidInterest = (interest: string, add: boolean) => {
    setNewKid((prev) => {
      const currentInterests = prev.interests ?? [];
      const interests = add
        ? [...currentInterests, interest]
        : currentInterests.filter((i) => i !== interest);
      return { ...prev, interests };
    });
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
    options: EnumOption[];
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
    options: EnumOption[];
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
            onClick={() =>
              updatePreferenceValue(field, selected === option.value ? '' : option.value)
            }
            className={`w-full rounded-lg border p-3 text-left transition-all ${
              selected === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } `}
          >
            <div className="text-sm font-medium">{option.label}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const KidCard = ({ kid }: { kid: KidResponse }) => {
    const isEditing = editingKid === kid.id;
    const [editData, setEditData] = useState<KidUpdate>({
      name: kid.name,
      dob: kid.dob,
      interests: kid.interests,
      special_needs: kid.special_needs,
      color: kid.color,
    });

    return (
      <div className="rounded-lg border p-4" style={{ borderColor: kid.color }}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white"
              style={{ backgroundColor: kid.color }}
            >
              {kid.name[0]?.toUpperCase()}
            </div>
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                    className="rounded border px-2 py-1 text-sm font-semibold"
                  />
                  <input
                    type="date"
                    value={editData.dob ?? ''}
                    onChange={(e) => setEditData((prev) => ({ ...prev, dob: e.target.value }))}
                    className="block rounded border px-2 py-1 text-sm"
                  />
                </div>
              ) : (
                <>
                  <h3 className="font-semibold">{kid.name}</h3>
                  {kid.dob && (
                    <p className="text-sm text-gray-600">
                      Age {kid.dob ? calculateAge(kid.dob) : 'N/A'} • Born{' '}
                      {kid.dob ? new Date(kid.dob).toLocaleDateString() : 'Unknown'}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => handleUpdateKid(kid.id, editData)}
                  className="rounded p-1 text-green-600 hover:bg-green-50"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setEditingKid(null)}
                  className="rounded p-1 text-gray-600 hover:bg-gray-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditingKid(kid.id)}
                  className="rounded p-1 text-blue-600 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteKid(kid.id)}
                  className="rounded p-1 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-2 flex items-center gap-2 font-medium">
            <Heart className="h-4 w-4" />
            Interests
          </h4>
          <div className="mb-3 flex flex-wrap gap-2">
            {(isEditing ? (editData?.interests ?? []) : (kid?.interests ?? [])).map((interest) => (
              <span
                key={interest}
                className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
              >
                {interest}
                <button
                  onClick={() => {
                    if (isEditing) {
                      setEditData((prev) => ({
                        ...prev,
                        interests: prev.interests?.filter((i) => i !== interest) ?? [],
                      }));
                    } else {
                      updateKidInterest(kid.id, interest, false);
                    }
                  }}
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
                const interest = e.currentTarget.value.trim();
                if (isEditing) {
                  setEditData((prev) => ({
                    ...prev,
                    interests: [...(prev.interests ?? []), interest],
                  }));
                } else {
                  updateKidInterest(kid.id, interest, true);
                }
                e.currentTarget.value = '';
              }
            }}
          />
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="rounded-md p-1 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold">Family Settings</h1>
            </div>
          </div>
        </header>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading settings...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="rounded-md p-1 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold">Family Settings</h1>
            </div>
          </div>
        </header>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-red-600">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!settingsOptions) {
    return null;
  }

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
              onClick={() => setActiveTab('profile')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              } `}
            >
              Family Profile
            </button>
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
            <button
              onClick={() => setActiveTab('account')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'account'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              } `}
            >
              Account Settings
            </button>
          </nav>
        </div>

        {/* Family Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Family Profile</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <LocationInput familyProfile={familyProfile} setFamilyProfile={setFamilyProfile} />

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    <Users className="mr-2 inline h-4 w-4" />
                    Family Size
                  </label>
                  <select
                    value={familyProfile.family_size || 1}
                    onChange={(e) =>
                      setFamilyProfile((prev) => ({
                        ...prev,
                        family_size: parseInt(e.target.value),
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                      <option key={size} value={size}>
                        {size} {size === 1 ? 'person' : 'people'}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Total number of family members who might participate
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kids Tab */}
        {activeTab === 'kids' && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Your Kids</h2>
                </div>
                <button
                  onClick={() => setAddingKid(true)}
                  className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Kid
                </button>
              </div>

              {/* Add New Kid Form */}
              {addingKid && (
                <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h3 className="mb-4 font-semibold">Add New Kid</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Name</label>
                      <input
                        type="text"
                        value={newKid.name}
                        onChange={(e) => setNewKid((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-md border px-3 py-2"
                        placeholder="Enter kid's name"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Date of Birth</label>
                      <input
                        type="date"
                        value={newKid.dob ?? ''}
                        onChange={(e) => setNewKid((prev) => ({ ...prev, dob: e.target.value }))}
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium">Interests</label>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {newKid.interests &&
                        newKid.interests.map((interest) => (
                          <span
                            key={interest}
                            className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                          >
                            {interest}
                            <button
                              onClick={() => updateNewKidInterest(interest, false)}
                              className="hover:text-blue-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add interest and press Enter"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          updateNewKidInterest(e.currentTarget.value.trim(), true);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleCreateKid}
                      disabled={!newKid.name || !newKid.dob}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
                    >
                      Add Kid
                    </button>
                    <button
                      onClick={() => setAddingKid(false)}
                      className="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {kids.map((kid) => (
                  <KidCard key={kid.id} kid={kid} />
                ))}
                {kids.length === 0 && !addingKid && (
                  <div className="col-span-2 py-8 text-center text-gray-500">
                    No kids added yet. Click "Add Kid" to get started!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <MultiSelectCard
              title="Preferred Themes"
              options={settingsOptions.filters.themes}
              selected={preferences.preferred_themes}
              field="preferred_themes"
              icon={Star}
              maxSelect={5}
            />

            <MultiSelectCard
              title="Preferred Activity Types"
              options={settingsOptions.filters.activity_types}
              selected={preferences.preferred_activity_types}
              field="preferred_activity_types"
              icon={Heart}
              maxSelect={6}
            />

            <MultiSelectCard
              title="Learning Priorities"
              options={settingsOptions.preferences.learning_priorities}
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
              options={settingsOptions.preferences.available_days}
              selected={preferences.available_days}
              field="available_days"
              icon={Calendar}
            />

            <MultiSelectCard
              title="Preferred Time Slots"
              options={settingsOptions.preferences.preferred_time_slots}
              selected={preferences.preferred_time_slots}
              field="preferred_time_slots"
              icon={Clock}
            />

            <RadioCard
              title="Group Activity Comfort Level"
              options={settingsOptions.preferences.group_activity_comfort}
              selected={preferences.group_activity_comfort ?? ''}
              field="group_activity_comfort"
              icon={Users}
            />

            <RadioCard
              title="Openness to New Experiences"
              options={settingsOptions.preferences.new_experience_openness}
              selected={preferences.new_experience_openness ?? ''}
              field="new_experience_openness"
              icon={Star}
            />
          </div>
        )}

        {activeTab === 'account' && <AccountSettings />}
      </div>
      <Toaster
        closeButton
        position="top-center"
        richColors
        expand={true}
        toastOptions={{
          style: {
            padding: '16px',
            fontSize: '14px',
            minHeight: '60px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          className: 'font-medium',
        }}
      />
    </div>
  );
}
