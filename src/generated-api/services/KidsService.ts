/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { KidCreate } from '../models/KidCreate';
import type { KidResponse } from '../models/KidResponse';
import type { KidUpdate } from '../models/KidUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class KidsService {
  /**
   * Get Kids
   * Get all kids for the current user.
   * @returns KidResponse Successful Response
   * @throws ApiError
   */
  public static getKidsApiV1KidsGet(): CancelablePromise<Array<KidResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/kids',
    });
  }
  /**
   * Get Kids
   * Get all kids for the current user.
   * @returns KidResponse Successful Response
   * @throws ApiError
   */
  public static getKidsApiV1KidsGet1(): CancelablePromise<Array<KidResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/kids',
    });
  }
  /**
   * Create Kid
   * Create a new kid.
   * @returns KidResponse Successful Response
   * @throws ApiError
   */
  public static createKidApiV1KidsPost({
    requestBody,
  }: {
    requestBody: KidCreate;
  }): CancelablePromise<KidResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/kids',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Create Kid
   * Create a new kid.
   * @returns KidResponse Successful Response
   * @throws ApiError
   */
  public static createKidApiV1KidsPost1({
    requestBody,
  }: {
    requestBody: KidCreate;
  }): CancelablePromise<KidResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/kids',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Kid
   * Get a specific kid by ID.
   * @returns KidResponse Successful Response
   * @throws ApiError
   */
  public static getKidApiV1KidsKidIdGet({
    kidId,
  }: {
    kidId: number;
  }): CancelablePromise<KidResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/kids/{kid_id}',
      path: {
        kid_id: kidId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Kid
   * Get a specific kid by ID.
   * @returns KidResponse Successful Response
   * @throws ApiError
   */
  public static getKidApiV1KidsKidIdGet1({
    kidId,
  }: {
    kidId: number;
  }): CancelablePromise<KidResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/kids/{kid_id}',
      path: {
        kid_id: kidId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Kid
   * Update a kid's information.
   * @returns KidResponse Successful Response
   * @throws ApiError
   */
  public static updateKidApiV1KidsKidIdPatch({
    kidId,
    requestBody,
  }: {
    kidId: number;
    requestBody: KidUpdate;
  }): CancelablePromise<KidResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/kids/{kid_id}',
      path: {
        kid_id: kidId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Kid
   * Update a kid's information.
   * @returns KidResponse Successful Response
   * @throws ApiError
   */
  public static updateKidApiV1KidsKidIdPatch1({
    kidId,
    requestBody,
  }: {
    kidId: number;
    requestBody: KidUpdate;
  }): CancelablePromise<KidResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/kids/{kid_id}',
      path: {
        kid_id: kidId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete Kid
   * Delete a kid.
   * @returns void
   * @throws ApiError
   */
  public static deleteKidApiV1KidsKidIdDelete({
    kidId,
  }: {
    kidId: number;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/kids/{kid_id}',
      path: {
        kid_id: kidId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete Kid
   * Delete a kid.
   * @returns void
   * @throws ApiError
   */
  public static deleteKidApiV1KidsKidIdDelete1({
    kidId,
  }: {
    kidId: number;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/kids/{kid_id}',
      path: {
        kid_id: kidId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
