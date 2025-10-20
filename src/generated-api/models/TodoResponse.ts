/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemStatus } from './ItemStatus';
import type { Priority } from './Priority';
/**
 * Schema for todo responses
 */
export type TodoResponse = {
  created_at: string;
  updated_at: string;
  /**
   * Todo title
   */
  title: string;
  /**
   * Todo description
   */
  description?: string | null;
  /**
   * Priority level
   */
  priority?: Priority | null;
  /**
   * Due date
   */
  due_date?: string | null;
  /**
   * Estimated hours to complete
   */
  estimated_hours?: number | null;
  /**
   * Comma-separated tags
   */
  tags?: string | null;
  /**
   * Todo ID
   */
  id: number;
  /**
   * Todo status
   */
  status: ItemStatus;
  /**
   * Completion timestamp
   */
  completed_at?: string | null;
  /**
   * Whether todo is overdue
   */
  is_overdue: boolean;
};
