/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ActivityType } from './ActivityType';
import type { Cost } from './Cost';
import type { DaysOfWeek } from './DaysOfWeek';
import type { GroupActivityComfort } from './GroupActivityComfort';
import type { Location } from './Location';
import type { NewExperienceOpenness } from './NewExperienceOpenness';
import type { PreferredTimeSlot } from './PreferredTimeSlot';
import type { Theme } from './Theme';
/**
 * Response model for family preferences.
 */
export type FamilyPreferenceResponse = {
  /**
   * Preference ID
   */
  id?: number | null;
  /**
   * User ID
   */
  user_id?: number | null;
  /**
   * Preferred activity themes
   */
  preferred_themes?: Array<Theme>;
  /**
   * Preferred activity types
   */
  preferred_activity_types?: Array<ActivityType>;
  /**
   * Preferred cost ranges
   */
  preferred_cost_ranges?: Array<Cost>;
  /**
   * Preferred locations
   */
  preferred_locations?: Array<Location>;
  /**
   * Available days of the week
   */
  available_days?: Array<DaysOfWeek>;
  /**
   * Preferred time slots
   */
  preferred_time_slots?: Array<PreferredTimeSlot>;
  /**
   * Group activity comfort level
   */
  group_activity_comfort?: GroupActivityComfort | null;
  /**
   * Openness to new experiences
   */
  new_experience_openness?: NewExperienceOpenness | null;
  /**
   * Educational priorities
   */
  educational_priorities?: Array<string>;
  /**
   * Equipment owned by family
   */
  equipment_owned?: Array<string>;
  /**
   * Accessibility needs
   */
  accessibility_needs?: Array<string>;
  /**
   * Special requirements
   */
  special_requirements?: string | null;
  /**
   * Last update timestamp
   */
  updated_at?: string | null;
};
