/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemStatus } from './ItemStatus';
import type { ShoppingCategory } from './ShoppingCategory';
/**
 * Schema for shopping responses
 */
export type ShoppingResponse = {
  created_at: string;
  updated_at: string;
  /**
   * Item name
   */
  item_name: string;
  /**
   * Quantity needed
   */
  quantity?: string | null;
  /**
   * Item category
   */
  category?: ShoppingCategory | null;
  /**
   * Additional notes
   */
  notes?: string | null;
  /**
   * Estimated price
   */
  estimated_price?: number | null;
  /**
   * Store name
   */
  store_name?: string | null;
  /**
   * Priority (0-10)
   */
  priority?: number | null;
  /**
   * Shopping item ID
   */
  id: number;
  /**
   * Item status
   */
  status: ItemStatus;
  /**
   * Actual price paid
   */
  actual_price?: number | null;
  /**
   * Price verified
   */
  price_verified?: boolean | null;
  /**
   * Purchase timestamp
   */
  purchased_at?: string | null;
};
