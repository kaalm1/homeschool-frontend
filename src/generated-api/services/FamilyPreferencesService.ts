/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllSettingsResponse } from '../models/AllSettingsResponse';
import type { FilterOptionsResponse } from '../models/FilterOptionsResponse';
import type { PreferenceOptionsResponse } from '../models/PreferenceOptionsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FamilyPreferencesService {
    /**
     * Get Preference Options
     * Get all available preference options for family settings.
     * @returns PreferenceOptionsResponse Successful Response
     * @throws ApiError
     */
    public static getPreferenceOptionsApiV1FamilyPreferencesSettingsPreferencesGet(): CancelablePromise<PreferenceOptionsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/family-preferences/settings/preferences',
        });
    }
    /**
     * Get Filters Options
     * Get all available filter options for activities.
     * @returns FilterOptionsResponse Successful Response
     * @throws ApiError
     */
    public static getFiltersOptionsApiV1FamilyPreferencesSettingsFiltersGet(): CancelablePromise<FilterOptionsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/family-preferences/settings/filters',
        });
    }
    /**
     * Get All Settings
     * Get all settings options - both activity filters and user preferences.
     * @returns AllSettingsResponse Successful Response
     * @throws ApiError
     */
    public static getAllSettingsApiV1FamilyPreferencesSettingsAllGet(): CancelablePromise<AllSettingsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/family-preferences/settings/all',
        });
    }
}
