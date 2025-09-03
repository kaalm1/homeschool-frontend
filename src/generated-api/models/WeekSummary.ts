/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WeekActivityResponse } from './WeekActivityResponse';
/**
 * Summary of activities for a specific week.
 */
export type WeekSummary = {
  year: number;
  week: number;
  start_date: string;
  end_date: string;
  activities: Array<WeekActivityResponse>;
  total_activities: number;
  completed_activities: number;
  completion_rate: number;
  average_rating: number | null;
};
