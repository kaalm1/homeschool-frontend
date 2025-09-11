/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response model for family preferences.
 */
export type FamilyPreferenceResponse = {
    /**
     * Preference ID
     */
    id?: (number | null);
    /**
     * User ID
     */
    user_id?: (number | null);
    /**
     * Preferred activity themes
     */
    preferred_themes?: Array<string>;
    /**
     * Preferred activity types
     */
    preferred_activity_types?: Array<string>;
    /**
     * Preferred cost ranges
     */
    preferred_cost_ranges?: Array<string>;
    /**
     * Preferred locations
     */
    preferred_locations?: Array<string>;
    /**
     * Available days of the week
     */
    available_days?: Array<string>;
    /**
     * Preferred time slots
     */
    preferred_time_slots?: Array<string>;
    /**
     * Group activity comfort level
     */
    group_activity_comfort?: string;
    /**
     * Openness to new experiences
     */
    new_experience_openness?: string;
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
    special_requirements?: (string | null);
    /**
     * Last update timestamp
     */
    updated_at?: (string | null);
};

