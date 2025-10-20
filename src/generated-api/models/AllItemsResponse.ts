/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalendarResponse } from './CalendarResponse';
import type { ShoppingResponse } from './ShoppingResponse';
import type { TodoResponse } from './TodoResponse';
/**
 * Response for all items
 */
export type AllItemsResponse = {
  /**
   * All todo items
   */
  todos?: Array<TodoResponse>;
  /**
   * All shopping items
   */
  shopping?: Array<ShoppingResponse>;
  /**
   * All calendar events
   */
  calendar?: Array<CalendarResponse>;
  /**
   * Summary statistics for each type
   */
  summaries?: Record<string, Record<string, any>>;
};
