/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActivityType } from './ActivityType';
import type { Cost } from './Cost';
import type { DaysOfWeek } from './DaysOfWeek';
import type { GroupActivityComfort } from './GroupActivityComfort';
import type { Location } from './Location';
import type { NewExperienceOpenness } from './NewExperienceOpenness';
import type { PreferredTimeSlot } from './PreferredTimeSlot';
import type { Theme } from './Theme';
/**
 * Request model for updating family preferences.
 */
export type FamilyPreferenceUpdateRequest = {
    /**
     * Preferred activity themes
     */
    preferred_themes?: (Array<Theme> | null);
    /**
     * Preferred activity types
     */
    preferred_activity_types?: (Array<ActivityType> | null);
    /**
     * Preferred cost ranges
     */
    preferred_cost_ranges?: (Array<Cost> | null);
    /**
     * Preferred locations
     */
    preferred_locations?: (Array<Location> | null);
    /**
     * Available days of the week
     */
    available_days?: (Array<DaysOfWeek> | null);
    /**
     * Preferred time slots
     */
    preferred_time_slots?: (Array<PreferredTimeSlot> | null);
    /**
     * Group activity comfort level
     */
    group_activity_comfort?: (GroupActivityComfort | null);
    /**
     * Openness to new experiences
     */
    new_experience_openness?: (NewExperienceOpenness | null);
    /**
     * Educational priorities
     */
    educational_priorities?: (Array<string> | null);
    /**
     * Equipment owned by family
     */
    equipment_owned?: (Array<string> | null);
    /**
     * Accessibility needs
     */
    accessibility_needs?: (Array<string> | null);
    /**
     * Special requirements
     */
    special_requirements?: (string | null);
};

