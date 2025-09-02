/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

/**
 * Token response model.
 */
export type TokenResponse = {
  /**
   * JWT access token
   */
  access_token: string;
  /**
   * Token type
   */
  token_type?: string;
  /**
   * Token expiration time in seconds
   */
  expires_in: number;
};
