/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RewardSummary } from '../models/RewardSummary';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RewardsService {
  /**
   * Get Reward Summary
   * Get reward summary showing stars earned by each kid.
   * @returns RewardSummary Successful Response
   * @throws ApiError
   */
  public static getRewardSummaryApiV1RewardsSummaryGet(): CancelablePromise<Array<RewardSummary>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/rewards/summary',
    });
  }
  /**
   * Get Reward Summary
   * Get reward summary showing stars earned by each kid.
   * @returns RewardSummary Successful Response
   * @throws ApiError
   */
  public static getRewardSummaryApiV1RewardsSummaryGet1(): CancelablePromise<Array<RewardSummary>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/rewards/summary',
    });
  }
}
