/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResponse } from '../models/UserResponse';
import type { UserUpdate } from '../models/UserUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
  /**
   * Get User Profile
   * Get current user's profile information.
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static getUserProfileApiV1UserProfileGet(): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/user/profile',
    });
  }
  /**
   * Get User Profile
   * Get current user's profile information.
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static getUserProfileApiV1UserProfileGet1(): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/user/profile',
    });
  }
  /**
   * Update Current User Profile
   * Update current user's profile information.
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static updateCurrentUserProfileApiV1UserProfilePatch({
    requestBody,
  }: {
    requestBody: UserUpdate;
  }): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/user/profile',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Current User Profile
   * Update current user's profile information.
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static updateCurrentUserProfileApiV1UserProfilePatch1({
    requestBody,
  }: {
    requestBody: UserUpdate;
  }): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/user/profile',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get User
   * Get a specific user by ID.
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static getUserApiV1UserUserIdGet({
    userId,
  }: {
    userId: number;
  }): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/user/{user_id}',
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get User
   * Get a specific user by ID.
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static getUserApiV1UserUserIdGet1({
    userId,
  }: {
    userId: number;
  }): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/user/{user_id}',
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update User
   * Update user information.
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static updateUserApiV1UserUserIdPatch({
    userId,
    requestBody,
  }: {
    userId: number;
    requestBody: UserUpdate;
  }): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/user/{user_id}',
      path: {
        user_id: userId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update User
   * Update user information.
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static updateUserApiV1UserUserIdPatch1({
    userId,
    requestBody,
  }: {
    userId: number;
    requestBody: UserUpdate;
  }): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/user/{user_id}',
      path: {
        user_id: userId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Deactivate User
   * Deactivate user account.
   * @returns void
   * @throws ApiError
   */
  public static deactivateUserApiV1UserUserIdDelete({
    userId,
  }: {
    userId: number;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/user/{user_id}',
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Deactivate User
   * Deactivate user account.
   * @returns void
   * @throws ApiError
   */
  public static deactivateUserApiV1UserUserIdDelete1({
    userId,
  }: {
    userId: number;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/user/{user_id}',
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
