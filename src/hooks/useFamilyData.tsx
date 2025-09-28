import { useQueries } from '@tanstack/react-query';
import {
  SettingsService,
  FamilyPreferencesService,
  KidsService,
  UsersService,
  type FamilyPreferenceResponse,
  type UserResponse,
  type KidResponse,
  type AllSettingsResponse,
} from '@/generated-api'; // adjust import paths based on your setup

type FamilyDataResult = {
  settings?: AllSettingsResponse;
  preferences?: FamilyPreferenceResponse;
  kids?: KidResponse[];
  userProfile?: UserResponse;
  isLoading: boolean;
  isError: boolean;
};

export function useFamilyData(): FamilyDataResult {
  const results = useQueries({
    queries: [
      {
        queryKey: ['settings'],
        queryFn: () =>
          SettingsService.getAllSettingsApiV1SettingsSettingsAllGet().catch(() => undefined),
      },
      {
        queryKey: ['preferences'],
        queryFn: () =>
          FamilyPreferencesService.getFamilyPreferencesApiV1FamilyPreferencesApiV1FamilyPreferencesGet().catch(
            () => undefined
          ),
      },
      {
        queryKey: ['kids'],
        queryFn: () => KidsService.getKidsApiV1KidsGet().catch(() => []),
      },
      {
        queryKey: ['userProfile'],
        queryFn: () => UsersService.getUserProfileApiV1UserProfileGet().catch(() => undefined),
      },
    ],
  });

  const [settings, preferences, kids, userProfile] = results;

  return {
    settings: settings.data,
    preferences: preferences.data,
    kids: kids.data,
    userProfile: userProfile.data,
    isLoading: results.some((r) => r.isLoading),
    isError: results.some((r) => r.isError),
  };
}
