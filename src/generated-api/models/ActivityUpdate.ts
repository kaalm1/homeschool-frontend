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
export type ActivityUpdate = {
  /**
   * Activity title
   */
  title?: string | null;
  /**
   * Activity description
   */
  description?: string | null;
  /**
   * Activity completion status
   */
  done?: boolean | null;
  /**
   * Activity costs
   */
  costs?: Array<Cost> | null;
  /**
   * Activity durations
   */
  durations?: Array<Duration> | null;
  /**
   * Activity participants
   */
  participants?: Array<Participants> | null;
  /**
   * Activity locations
   */
  locations?: Array<Location> | null;
  /**
   * Activity seasons
   */
  seasons?: Array<Season> | null;
  /**
   * Activity age groups
   */
  age_groups?: Array<AgeGroup> | null;
  /**
   * Activity frequency
   */
  frequency?: Frequency | null;
  /**
   * Theme IDs
   */
  themes?: Array<Theme> | null;
  /**
   * ActivityType IDs
   */
  types?: Array<ActivityType> | null;
};
