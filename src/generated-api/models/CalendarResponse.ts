/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemStatus } from './ItemStatus';
/**
 * Schema for calendar responses
 */
export type CalendarResponse = {
  created_at: string;
  updated_at: string;
  /**
   * Event title
   */
  title: string;
  /**
   * Event description
   */
  description?: string | null;
  /**
   * Event location
   */
  location?: string | null;
  /**
   * Event start time
   */
  start_time: string;
  /**
   * Event end time
   */
  end_time?: string | null;
  /**
   * All day event
   */
  all_day?: boolean;
  /**
   * Reminder minutes before event
   */
  reminder_minutes?: number | null;
  /**
   * Meeting URL
   */
  url?: string | null;
  /**
   * Comma-separated attendees
   */
  attendees?: string | null;
  /**
   * Is recurring event
   */
  is_recurring?: boolean;
  /**
   * RRULE for recurrence
   */
  recurrence_rule?: string | null;
  /**
   * Event ID
   */
  id: number;
  /**
   * Event status
   */
  status: ItemStatus;
  /**
   * Whether event is in the past
   */
  is_past?: boolean;
  /**
   * Whether event is within 24 hours
   */
  is_upcoming?: boolean;
};
