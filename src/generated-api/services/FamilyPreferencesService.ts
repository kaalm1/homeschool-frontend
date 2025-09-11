/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FamilyPreferenceResponse } from '../models/FamilyPreferenceResponse';
import type { FamilyPreferenceUpdateRequest } from '../models/FamilyPreferenceUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FamilyPreferencesService {
    /**
     * Get Family Preferences
     * Get current user's family preferences.
     *
     * Returns all family preferences for the authenticated user,
     * including default values if no preferences are set.
     * @returns FamilyPreferenceResponse Successful Response
     * @throws ApiError
     */
    public static getFamilyPreferencesApiV1FamilyPreferencesApiV1FamilyPreferencesGet(): CancelablePromise<FamilyPreferenceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/family-preferences/api/v1/family/preferences',
        });
    }
    /**
     * Get Family Preferences
     * Get current user's family preferences.
     *
     * Returns all family preferences for the authenticated user,
     * including default values if no preferences are set.
     * @returns FamilyPreferenceResponse Successful Response
     * @throws ApiError
     */
    public static getFamilyPreferencesApiV1FamilyPreferencesApiV1FamilyPreferencesGet1(): CancelablePromise<FamilyPreferenceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/family-preferences/api/v1/family/preferences',
        });
    }
    /**
     * Update Family Preferences
     * Update family preferences for the current user.
     *
     * Updates the user's family preferences with the provided data.
     * Creates new preferences if none exist, otherwise updates existing ones.
     * @returns FamilyPreferenceResponse Successful Response
     * @throws ApiError
     */
    public static updateFamilyPreferencesApiV1FamilyPreferencesApiV1FamilyPreferencesPut({
        requestBody,
    }: {
        requestBody: FamilyPreferenceUpdateRequest,
    }): CancelablePromise<FamilyPreferenceResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/family-preferences/api/v1/family/preferences',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Family Preferences
     * Update family preferences for the current user.
     *
     * Updates the user's family preferences with the provided data.
     * Creates new preferences if none exist, otherwise updates existing ones.
     * @returns FamilyPreferenceResponse Successful Response
     * @throws ApiError
     */
    public static updateFamilyPreferencesApiV1FamilyPreferencesApiV1FamilyPreferencesPut1({
        requestBody,
    }: {
        requestBody: FamilyPreferenceUpdateRequest,
    }): CancelablePromise<FamilyPreferenceResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/family-preferences/api/v1/family/preferences',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reset Family Preferences
     * Reset family preferences to defaults.
     *
     * Deletes all custom preferences for the user, effectively resetting to defaults.
     * @returns string Successful Response
     * @throws ApiError
     */
    public static resetFamilyPreferencesApiV1FamilyPreferencesApiV1FamilyPreferencesDelete(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/family-preferences/api/v1/family/preferences',
        });
    }
    /**
     * Reset Family Preferences
     * Reset family preferences to defaults.
     *
     * Deletes all custom preferences for the user, effectively resetting to defaults.
     * @returns string Successful Response
     * @throws ApiError
     */
    public static resetFamilyPreferencesApiV1FamilyPreferencesApiV1FamilyPreferencesDelete1(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/family-preferences/api/v1/family/preferences',
        });
    }
    /**
     * Partial Update Family Preferences
     * Partially update family preferences for the current user.
     *
     * Updates only the provided fields, leaving others unchanged.
     * @returns FamilyPreferenceResponse Successful Response
     * @throws ApiError
     */
    public static partialUpdateFamilyPreferencesApiV1FamilyPreferencesApiV1FamilyPreferencesPatch({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<FamilyPreferenceResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/family-preferences/api/v1/family/preferences',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Partial Update Family Preferences
     * Partially update family preferences for the current user.
     *
     * Updates only the provided fields, leaving others unchanged.
     * @returns FamilyPreferenceResponse Successful Response
     * @throws ApiError
     */
    public static partialUpdateFamilyPreferencesApiV1FamilyPreferencesApiV1FamilyPreferencesPatch1({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<FamilyPreferenceResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/family-preferences/api/v1/family/preferences',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
