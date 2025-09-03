/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkWeekActivityCreate } from '../models/BulkWeekActivityCreate';
import type { WeekActivityCreate } from '../models/WeekActivityCreate';
import type { WeekActivityResponse } from '../models/WeekActivityResponse';
import type { WeekActivityUpdate } from '../models/WeekActivityUpdate';
import type { WeekSummary } from '../models/WeekSummary';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WeekActivitiesService {
  /**
   * Create Week Activity
   * Create a new week activity assignment.
   * @returns WeekActivityResponse Successful Response
   * @throws ApiError
   */
  public static createWeekActivityApiV1WeekActivitiesWeekActivitiesPost({
    requestBody,
  }: {
    requestBody: WeekActivityCreate;
  }): CancelablePromise<WeekActivityResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/week-activities/week-activities',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Week Activities
   * Get week activities with optional filters.
   * @returns WeekActivityResponse Successful Response
   * @throws ApiError
   */
  public static getWeekActivitiesApiV1WeekActivitiesWeekActivitiesGet({
    year,
    week,
    completedOnly,
  }: {
    /**
     * Year to filter by
     */
    year?: number | null;
    /**
     * Week number to filter by (1-53)
     */
    week?: number | null;
    /**
     * Filter by completion status
     */
    completedOnly?: boolean | null;
  }): CancelablePromise<Array<WeekActivityResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/week-activities/week-activities',
      query: {
        year: year,
        week: week,
        completed_only: completedOnly,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Week Activity
   * Update a week activity's completion status, rating, and notes.
   * @returns WeekActivityResponse Successful Response
   * @throws ApiError
   */
  public static updateWeekActivityApiV1WeekActivitiesWeekActivitiesWeekActivityIdPut({
    weekActivityId,
    requestBody,
  }: {
    weekActivityId: number;
    requestBody: WeekActivityUpdate;
  }): CancelablePromise<WeekActivityResponse> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/week-activities/week-activities/{week_activity_id}',
      path: {
        week_activity_id: weekActivityId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete Week Activity
   * Delete a week activity assignment by ID.
   * @returns void
   * @throws ApiError
   */
  public static deleteWeekActivityApiV1WeekActivitiesWeekActivitiesWeekActivityIdDelete({
    weekActivityId,
  }: {
    weekActivityId: number;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/week-activities/week-activities/{week_activity_id}',
      path: {
        week_activity_id: weekActivityId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Toggle Week Activity
   * Toggle the completion status of a week activity.
   * @returns WeekActivityResponse Successful Response
   * @throws ApiError
   */
  public static toggleWeekActivityApiV1WeekActivitiesWeekActivitiesWeekActivityIdTogglePost({
    weekActivityId,
  }: {
    weekActivityId: number;
  }): CancelablePromise<WeekActivityResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/week-activities/week-activities/{week_activity_id}/toggle',
      path: {
        week_activity_id: weekActivityId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Bulk Create Week Activities
   * Create multiple week activity assignments at once.
   * @returns WeekActivityResponse Successful Response
   * @throws ApiError
   */
  public static bulkCreateWeekActivitiesApiV1WeekActivitiesWeekActivitiesBulkPost({
    requestBody,
  }: {
    requestBody: BulkWeekActivityCreate;
  }): CancelablePromise<Array<WeekActivityResponse>> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/week-activities/week-activities/bulk',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Current Week Activities
   * Get activities for the current week.
   * @returns WeekActivityResponse Successful Response
   * @throws ApiError
   */
  public static getCurrentWeekActivitiesApiV1WeekActivitiesWeekActivitiesCurrentGet(): CancelablePromise<
    Array<WeekActivityResponse>
  > {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/week-activities/week-activities/current',
    });
  }
  /**
   * Get Week Summary
   * Get a summary of activities for a specific week with completion stats.
   * @returns WeekSummary Successful Response
   * @throws ApiError
   */
  public static getWeekSummaryApiV1WeekActivitiesWeekActivitiesSummaryGet({
    year,
    week,
  }: {
    /**
     * Year (defaults to current year)
     */
    year?: number | null;
    /**
     * Week number (defaults to current week)
     */
    week?: number | null;
  }): CancelablePromise<WeekSummary> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/week-activities/week-activities/summary',
      query: {
        year: year,
        week: week,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Available Weeks
   * Get all weeks that have activities.
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getAvailableWeeksApiV1WeekActivitiesWeekActivitiesWeeksGet(): CancelablePromise<
    Array<Record<string, any>>
  > {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/week-activities/week-activities/weeks',
    });
  }
  /**
   * Remove Activity From Week
   * Remove a specific activity from a user's week.
   * @returns void
   * @throws ApiError
   */
  public static removeActivityFromWeekApiV1WeekActivitiesWeekActivitiesRemoveDelete({
    activityId,
    year,
    week,
  }: {
    /**
     * Activity ID
     */
    activityId: number;
    /**
     * Year (defaults to current year)
     */
    year?: number | null;
    /**
     * Week number (defaults to current week)
     */
    week?: number | null;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/week-activities/week-activities/remove',
      query: {
        activity_id: activityId,
        year: year,
        week: week,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
