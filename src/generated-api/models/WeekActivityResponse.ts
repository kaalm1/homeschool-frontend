/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

/**
 * Response model for week activity.
 */
export type WeekActivityResponse = {
  id: number;
  user_id: number;
  activity_id: number;
  year: number;
  week: number;
  completed: boolean;
  completed_at?: string | null;
  rating?: number | null;
  notes?: string | null;
  llm_notes?: string | null;
  equipment?: Array<string> | null;
  instructions?: Array<string> | null;
  adhd_tips?: Array<string> | null;
  equipment_done?: Array<string> | null;
  instructions_done?: Array<string> | null;
  adhd_tips_done?: Array<string> | null;
  activity_title?: string | null;
  activity_description?: string | null;
  activity_equipment?: Array<string> | null;
  activity_instructions?: Array<string> | null;
  activity_adhd_tips?: Array<string> | null;
  user_name?: string | null;
};
