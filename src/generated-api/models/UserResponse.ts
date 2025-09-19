/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * User response model.
 */
export type UserResponse = {
  created_at: string;
  updated_at: string;
  /**
   * User email address
   */
  email: string;
  /**
   * User ID
   */
  id: number;
  /**
   * User active status
   */
  is_active: boolean;
  /**
   * User location address
   */
  address?: string | null;
  /**
   * User zipcode
   */
  zipcode?: string | null;
  /**
   * User family size
   */
  family_size?: number | null;
};
