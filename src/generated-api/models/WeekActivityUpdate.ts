/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Update completion status and rating for a week activity.
 */
export type WeekActivityUpdate = {
  /**
   * Whether the activity was completed
   */
  completed?: boolean | null;
  /**
   * Rating from 1-5 stars
   */
  rating?: number | null;
  /**
   * Optional notes about the experience
   */
  llm_notes?: string | null;
  /**
   * Optional notes about the experience
   */
  notes?: string | null;
  equipment?: Array<string> | null;
  instructions?: Array<string> | null;
  adhd_tips?: Array<string> | null;
  equipment_done?: Array<string> | null;
  instructions_done?: Array<string> | null;
  adhd_tips_done?: Array<string> | null;
};
