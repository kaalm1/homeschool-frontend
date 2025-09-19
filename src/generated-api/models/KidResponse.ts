/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

/**
 * Kid response model.
 */
export type KidResponse = {
  created_at: string;
  updated_at: string;
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
  /**
   * Kid ID
   */
  id: number;
  /**
   * Parent user ID
   */
  parent_id: number;
};
