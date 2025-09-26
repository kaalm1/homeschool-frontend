/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActivityCreate } from '../models/ActivityCreate';
import type { ActivityResponse } from '../models/ActivityResponse';
import type { ActivityUpdate } from '../models/ActivityUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ActivitiesService {
    /**
     * Get Activity Filters
     * Get all available filter options for activities.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getActivityFiltersApiV1ActivitiesFiltersGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/activities/filters',
        });
    }
    /**
     * Get Activity Filters
     * Get all available filter options for activities.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getActivityFiltersApiV1ActivitiesFiltersGet1(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/activities/filters',
        });
    }
    /**
     * Get Activities
     * Get activities for the current user. Optionally filter by kid.
     * @returns ActivityResponse Successful Response
     * @throws ApiError
     */
    public static getActivitiesApiV1ActivitiesGet({
        kidId,
    }: {
        /**
         * Filter by kid ID
         */
        kidId?: number,
    }): CancelablePromise<Array<ActivityResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/activities',
            query: {
                'kid_id': kidId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Activities
     * Get activities for the current user. Optionally filter by kid.
     * @returns ActivityResponse Successful Response
     * @throws ApiError
     */
    public static getActivitiesApiV1ActivitiesGet1({
        kidId,
    }: {
        /**
         * Filter by kid ID
         */
        kidId?: number,
    }): CancelablePromise<Array<ActivityResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/activities',
            query: {
                'kid_id': kidId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Activity
     * Create a new activity.
     * @returns ActivityResponse Successful Response
     * @throws ApiError
     */
    public static createActivityApiV1ActivitiesPost({
        requestBody,
    }: {
        requestBody: ActivityCreate,
    }): CancelablePromise<ActivityResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/activities',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Activity
     * Create a new activity.
     * @returns ActivityResponse Successful Response
     * @throws ApiError
     */
    public static createActivityApiV1ActivitiesPost1({
        requestBody,
    }: {
        requestBody: ActivityCreate,
    }): CancelablePromise<ActivityResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/activities',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Activity
     * Get a specific activity by ID.
     * @returns ActivityResponse Successful Response
     * @throws ApiError
     */
    public static getActivityApiV1ActivitiesActivityIdGet({
        activityId,
    }: {
        activityId: number,
    }): CancelablePromise<ActivityResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/activities/{activity_id}',
            path: {
                'activity_id': activityId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Activity
     * Get a specific activity by ID.
     * @returns ActivityResponse Successful Response
     * @throws ApiError
     */
    public static getActivityApiV1ActivitiesActivityIdGet1({
        activityId,
    }: {
        activityId: number,
    }): CancelablePromise<ActivityResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/activities/{activity_id}',
            path: {
                'activity_id': activityId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Activity
     * Update an activity.
     * @returns ActivityResponse Successful Response
     * @throws ApiError
     */
    public static updateActivityApiV1ActivitiesActivityIdPatch({
        activityId,
        requestBody,
    }: {
        activityId: number,
        requestBody: ActivityUpdate,
    }): CancelablePromise<ActivityResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/activities/{activity_id}',
            path: {
                'activity_id': activityId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Activity
     * Update an activity.
     * @returns ActivityResponse Successful Response
     * @throws ApiError
     */
    public static updateActivityApiV1ActivitiesActivityIdPatch1({
        activityId,
        requestBody,
    }: {
        activityId: number,
        requestBody: ActivityUpdate,
    }): CancelablePromise<ActivityResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/activities/{activity_id}',
            path: {
                'activity_id': activityId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Activity
     * Delete an activity.
     * @returns void
     * @throws ApiError
     */
    public static deleteActivityApiV1ActivitiesActivityIdDelete({
        activityId,
    }: {
        activityId: number,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/activities/{activity_id}',
            path: {
                'activity_id': activityId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Activity
     * Delete an activity.
     * @returns void
     * @throws ApiError
     */
    public static deleteActivityApiV1ActivitiesActivityIdDelete1({
        activityId,
    }: {
        activityId: number,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/activities/{activity_id}',
            path: {
                'activity_id': activityId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Toggle Activity
     * Toggle activity completion status.
     * @returns ActivityResponse Successful Response
     * @throws ApiError
     */
    public static toggleActivityApiV1ActivitiesActivityIdTogglePost({
        activityId,
    }: {
        activityId: number,
    }): CancelablePromise<ActivityResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/activities/{activity_id}/toggle',
            path: {
                'activity_id': activityId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Toggle Activity
     * Toggle activity completion status.
     * @returns ActivityResponse Successful Response
     * @throws ApiError
     */
    public static toggleActivityApiV1ActivitiesActivityIdTogglePost1({
        activityId,
    }: {
        activityId: number,
    }): CancelablePromise<ActivityResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/activities/{activity_id}/toggle',
            path: {
                'activity_id': activityId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Checklist
     * Get activities for the current user. Optionally filter by kid.
     * @returns ActivityResponse Successful Response
     * @throws ApiError
     */
    public static createChecklistApiV1ActivitiesActivityIdChecklistPost({
        activityId,
    }: {
        activityId: number,
    }): CancelablePromise<ActivityResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/activities/{activity_id}/checklist',
            path: {
                'activity_id': activityId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Checklist
     * Get activities for the current user. Optionally filter by kid.
     * @returns ActivityResponse Successful Response
     * @throws ApiError
     */
    public static createChecklistApiV1ActivitiesActivityIdChecklistPost1({
        activityId,
    }: {
        activityId: number,
    }): CancelablePromise<ActivityResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/activities/{activity_id}/checklist',
            path: {
                'activity_id': activityId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
