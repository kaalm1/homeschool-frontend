/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Kid update model.
 */
export type KidUpdate = {
  /**
   * Kid's name
   */
  name: string;
  /**
   * Kid's color (hex)
   */
  color?: string;
  dob?: string | null;
  interests?: Array<string>;
  special_needs?: Array<string>;
};
