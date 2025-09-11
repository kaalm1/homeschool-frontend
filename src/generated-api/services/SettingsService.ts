/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SettingsService {
    /**
     * Get Preference Options
     * Get all available preference options for family settings.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getPreferenceOptionsApiV1SettingsSettingsPreferencesGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/settings/settings/preferences',
        });
    }
    /**
     * Get Preference Options
     * Get all available preference options for family settings.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getPreferenceOptionsApiV1SettingsSettingsPreferencesGet1(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/settings/settings/preferences',
        });
    }
    /**
     * Get Filters Options
     * Get all available filter options for activities.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getFiltersOptionsApiV1SettingsSettingsFiltersGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/settings/settings/filters',
        });
    }
    /**
     * Get Filters Options
     * Get all available filter options for activities.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getFiltersOptionsApiV1SettingsSettingsFiltersGet1(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/settings/settings/filters',
        });
    }
    /**
     * Get All Settings
     * Get all settings options - both activity filters and user preferences.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllSettingsApiV1SettingsSettingsAllGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/settings/settings/all',
        });
    }
    /**
     * Get All Settings
     * Get all settings options - both activity filters and user preferences.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllSettingsApiV1SettingsSettingsAllGet1(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/settings/settings/all',
        });
    }
}
