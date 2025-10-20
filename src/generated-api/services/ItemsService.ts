/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllItemsResponse } from '../models/AllItemsResponse';
import type { CalendarResponse } from '../models/CalendarResponse';
import type { ItemStatus } from '../models/ItemStatus';
import type { Priority } from '../models/Priority';
import type { ProcessedItemsResponse } from '../models/ProcessedItemsResponse';
import type { ShoppingCategory } from '../models/ShoppingCategory';
import type { ShoppingResponse } from '../models/ShoppingResponse';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { TodoResponse } from '../models/TodoResponse';
import type { UserInputRequest } from '../models/UserInputRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ItemsService {
  /**
   * Process user input
   * Parse raw user input and categorize into todos, shopping, and calendar items
   * @returns ProcessedItemsResponse Successful Response
   * @throws ApiError
   */
  public static processUserInputApiV1ItemsProcessPost({
    requestBody,
  }: {
    requestBody: UserInputRequest;
  }): CancelablePromise<ProcessedItemsResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/items/process',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get all active items
   * Retrieve all active items for current user
   * @returns AllItemsResponse Successful Response
   * @throws ApiError
   */
  public static getAllItemsApiV1ItemsAllGet(): CancelablePromise<AllItemsResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/items/all',
    });
  }
  /**
   * Get user summary
   * Get summary statistics for user's items
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getUserSummaryApiV1ItemsSummaryGet(): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/items/summary',
    });
  }
  /**
   * Get todo items
   * Get todo items for the current user. Optionally filter by status or priority.
   * @returns TodoResponse Successful Response
   * @throws ApiError
   */
  public static getTodosApiV1ItemsTodosGet({
    statusFilter,
    priority,
    skip,
    limit = 100,
  }: {
    /**
     * Filter by status
     */
    statusFilter?: ItemStatus | null;
    /**
     * Filter by priority
     */
    priority?: Priority | null;
    skip?: number;
    limit?: number;
  }): CancelablePromise<Array<TodoResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/items/todos',
      query: {
        status_filter: statusFilter,
        priority: priority,
        skip: skip,
        limit: limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get specific todo
   * Get a specific todo item by ID
   * @returns TodoResponse Successful Response
   * @throws ApiError
   */
  public static getTodoByIdApiV1ItemsTodosTodoIdGet({
    todoId,
  }: {
    /**
     * Todo ID
     */
    todoId: number;
  }): CancelablePromise<TodoResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/items/todos/{todo_id}',
      path: {
        todo_id: todoId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete todo
   * Soft delete a todo item
   * @returns SuccessResponse Successful Response
   * @throws ApiError
   */
  public static deleteTodoApiV1ItemsTodosTodoIdDelete({
    todoId,
  }: {
    /**
     * Todo ID
     */
    todoId: number;
  }): CancelablePromise<SuccessResponse> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/items/todos/{todo_id}',
      path: {
        todo_id: todoId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get overdue todos
   * Get overdue todo items for the current user
   * @returns TodoResponse Successful Response
   * @throws ApiError
   */
  public static getOverdueTodosApiV1ItemsTodosOverdueGet(): CancelablePromise<Array<TodoResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/items/todos/overdue',
    });
  }
  /**
   * Mark todo as complete
   * Mark a todo item as complete
   * @returns SuccessResponse Successful Response
   * @throws ApiError
   */
  public static markTodoCompleteApiV1ItemsTodosTodoIdCompletePatch({
    todoId,
  }: {
    /**
     * Todo ID
     */
    todoId: number;
  }): CancelablePromise<SuccessResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/items/todos/{todo_id}/complete',
      path: {
        todo_id: todoId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get shopping items
   * Get shopping items for the current user. Optionally filter by status or category.
   * @returns ShoppingResponse Successful Response
   * @throws ApiError
   */
  public static getShoppingApiV1ItemsShoppingGet({
    statusFilter,
    category,
    skip,
    limit = 100,
  }: {
    /**
     * Filter by status
     */
    statusFilter?: ItemStatus | null;
    /**
     * Filter by category
     */
    category?: ShoppingCategory | null;
    skip?: number;
    limit?: number;
  }): CancelablePromise<Array<ShoppingResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/items/shopping',
      query: {
        status_filter: statusFilter,
        category: category,
        skip: skip,
        limit: limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get specific shopping item
   * Get a specific shopping item by ID
   * @returns ShoppingResponse Successful Response
   * @throws ApiError
   */
  public static getShoppingByIdApiV1ItemsShoppingShoppingIdGet({
    shoppingId,
  }: {
    /**
     * Shopping item ID
     */
    shoppingId: number;
  }): CancelablePromise<ShoppingResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/items/shopping/{shopping_id}',
      path: {
        shopping_id: shoppingId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete shopping item
   * Soft delete a shopping item
   * @returns SuccessResponse Successful Response
   * @throws ApiError
   */
  public static deleteShoppingApiV1ItemsShoppingShoppingIdDelete({
    shoppingId,
  }: {
    /**
     * Shopping item ID
     */
    shoppingId: number;
  }): CancelablePromise<SuccessResponse> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/items/shopping/{shopping_id}',
      path: {
        shopping_id: shoppingId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Mark shopping item as purchased
   * Mark a shopping item as purchased
   * @returns SuccessResponse Successful Response
   * @throws ApiError
   */
  public static markShoppingPurchasedApiV1ItemsShoppingShoppingIdPurchasePatch({
    shoppingId,
    actualPrice,
  }: {
    /**
     * Shopping item ID
     */
    shoppingId: number;
    /**
     * Actual price paid
     */
    actualPrice?: number | null;
  }): CancelablePromise<SuccessResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/items/shopping/{shopping_id}/purchase',
      path: {
        shopping_id: shoppingId,
      },
      query: {
        actual_price: actualPrice,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get calendar events
   * Get calendar events for the current user. Optionally filter upcoming events.
   * @returns CalendarResponse Successful Response
   * @throws ApiError
   */
  public static getCalendarEventsApiV1ItemsCalendarGet({
    upcomingOnly = true,
    skip,
    limit = 100,
  }: {
    /**
     * Only show upcoming events
     */
    upcomingOnly?: boolean;
    skip?: number;
    limit?: number;
  }): CancelablePromise<Array<CalendarResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/items/calendar',
      query: {
        upcoming_only: upcomingOnly,
        skip: skip,
        limit: limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get today's events
   * Get today's calendar events for the current user
   * @returns CalendarResponse Successful Response
   * @throws ApiError
   */
  public static getTodayEventsApiV1ItemsCalendarTodayGet(): CancelablePromise<
    Array<CalendarResponse>
  > {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/items/calendar/today',
    });
  }
  /**
   * Get specific calendar event
   * Get a specific calendar event by ID
   * @returns CalendarResponse Successful Response
   * @throws ApiError
   */
  public static getCalendarByIdApiV1ItemsCalendarEventIdGet({
    eventId,
  }: {
    /**
     * Calendar event ID
     */
    eventId: number;
  }): CancelablePromise<CalendarResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/items/calendar/{event_id}',
      path: {
        event_id: eventId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete calendar event
   * Soft delete a calendar event
   * @returns SuccessResponse Successful Response
   * @throws ApiError
   */
  public static deleteCalendarApiV1ItemsCalendarEventIdDelete({
    eventId,
  }: {
    /**
     * Calendar event ID
     */
    eventId: number;
  }): CancelablePromise<SuccessResponse> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/items/calendar/{event_id}',
      path: {
        event_id: eventId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Mark calendar event as complete
   * Mark a calendar event as completed
   * @returns SuccessResponse Successful Response
   * @throws ApiError
   */
  public static markCalendarCompletedApiV1ItemsCalendarEventIdCompletePatch({
    eventId,
  }: {
    /**
     * Calendar event ID
     */
    eventId: number;
  }): CancelablePromise<SuccessResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/items/calendar/{event_id}/complete',
      path: {
        event_id: eventId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
