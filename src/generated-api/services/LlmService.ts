/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActivityTaggingRequest } from '../models/ActivityTaggingRequest';
import type { ActivityTaggingResponse } from '../models/ActivityTaggingResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LlmService {
  /**
   * Tag Activities
   * Tag activities using LLM
   * @returns ActivityTaggingResponse Successful Response
   * @throws ApiError
   */
  public static tagActivitiesApiV1LlmLlmTagActivitiesPost({
    requestBody,
  }: {
    requestBody: ActivityTaggingRequest;
  }): CancelablePromise<ActivityTaggingResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/llm/llm/tag-activities',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
