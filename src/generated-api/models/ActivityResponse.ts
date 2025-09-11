/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActivityType } from './ActivityType';
import type { AgeGroup } from './AgeGroup';
import type { Cost } from './Cost';
import type { Duration } from './Duration';
import type { Frequency } from './Frequency';
import type { Location } from './Location';
import type { Participants } from './Participants';
import type { Season } from './Season';
import type { Theme } from './Theme';
export type ActivityResponse = {
    created_at: string;
    updated_at: string;
    /**
     * Activity title
     */
    title: string;
    /**
     * Activity description
     */
    description?: (string | null);
    /**
     * Primary activity type
     */
    primary_type?: (ActivityType | null);
    /**
     * Primary theme response
     */
    primary_theme?: (Theme | null);
    /**
     * Activity costs
     */
    costs?: (Array<Cost> | null);
    /**
     * Activity durations
     */
    durations?: (Array<Duration> | null);
    /**
     * Activity participants
     */
    participants?: (Array<Participants> | null);
    /**
     * Activity locations
     */
    locations?: (Array<Location> | null);
    /**
     * Activity seasons
     */
    seasons?: (Array<Season> | null);
    /**
     * Activity age groups
     */
    age_groups?: (Array<AgeGroup> | null);
    /**
     * Activity frequency
     */
    frequency?: (Array<Frequency> | null);
    /**
     * Activity theme
     */
    themes?: (Array<Theme> | null);
    /**
     * Activity type
     */
    activity_types?: (Array<ActivityType> | null);
    /**
     * Activity ID
     */
    id: number;
    /**
     * Activity completion status
     */
    done: boolean;
    /**
     * Kid ID
     */
    kid_id?: (number | null);
};

