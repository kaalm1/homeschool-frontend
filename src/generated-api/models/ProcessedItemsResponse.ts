/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalendarResponse } from './CalendarResponse';
import type { ShoppingResponse } from './ShoppingResponse';
import type { TodoResponse } from './TodoResponse';
/**
 * Response for processed items from AI parsing
 */
export type ProcessedItemsResponse = {
  /**
   * Operation success status
   */
  success: boolean;
  /**
   * Response message
   */
  message: string;
  /**
   * Count summary of created items
   */
  summary: Record<string, number>;
  /**
   * Created todo items
   */
  todos?: Array<TodoResponse>;
  /**
   * Created shopping items
   */
  shopping?: Array<ShoppingResponse>;
  /**
   * Created calendar events
   */
  calendar?: Array<CalendarResponse>;
};
