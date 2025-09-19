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
export class SettingsService {
    /**
     * Get Preference Options
     * Get all available preference options for family settings.
     * @returns PreferenceOptionsResponse Successful Response
     * @throws ApiError
     */
    public static getPreferenceOptionsApiV1SettingsSettingsPreferencesGet(): CancelablePromise<PreferenceOptionsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/settings/settings/preferences',
        });
    }
    /**
     * Get Preference Options
     * Get all available preference options for family settings.
     * @returns PreferenceOptionsResponse Successful Response
     * @throws ApiError
     */
    public static getPreferenceOptionsApiV1SettingsSettingsPreferencesGet1(): CancelablePromise<PreferenceOptionsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/settings/settings/preferences',
        });
    }
    /**
     * Get Filters Options
     * Get all available filter options for activities.
     * @returns FilterOptionsResponse Successful Response
     * @throws ApiError
     */
    public static getFiltersOptionsApiV1SettingsSettingsFiltersGet(): CancelablePromise<FilterOptionsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/settings/settings/filters',
        });
    }
    /**
     * Get Filters Options
     * Get all available filter options for activities.
     * @returns FilterOptionsResponse Successful Response
     * @throws ApiError
     */
    public static getFiltersOptionsApiV1SettingsSettingsFiltersGet1(): CancelablePromise<FilterOptionsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/settings/settings/filters',
        });
    }
    /**
     * Get All Settings
     * Get all settings options - both activity filters and user preferences.
     * @returns AllSettingsResponse Successful Response
     * @throws ApiError
     */
    public static getAllSettingsApiV1SettingsSettingsAllGet(): CancelablePromise<AllSettingsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/settings/settings/all',
        });
    }
    /**
     * Get All Settings
     * Get all settings options - both activity filters and user preferences.
     * @returns AllSettingsResponse Successful Response
     * @throws ApiError
     */
    public static getAllSettingsApiV1SettingsSettingsAllGet1(): CancelablePromise<AllSettingsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/settings/settings/all',
        });
    }
}
