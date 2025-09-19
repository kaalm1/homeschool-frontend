/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Create a new week activity assignment.
 */
export type WeekActivityCreate = {
    /**
     * ID of the activity
     */
    activity_id: number;
    /**
     * Date for the week (defaults to current date)
     */
    activity_date?: (string | null);
    /**
     * Week of the activity
     */
    activity_week?: (number | null);
    /**
     * Year of the activity
     */
    activity_year?: (number | null);
    llm_suggestion?: (boolean | null);
    llm_notes?: (string | null);
};

