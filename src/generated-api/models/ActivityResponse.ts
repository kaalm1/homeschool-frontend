/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
/**
 * Activity response model.
 */
export type ActivityResponse = {
    created_at: string;
    updated_at: string;
    /**
     * Activity title
     */
    title: string;
    /**
     * Activity subject
     */
    subject?: string;
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
    kid_id: number;
};

