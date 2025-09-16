export interface UserPreference {
  id?: number;
  user_id?: number;
  timezone: string;
  currency: string;
  default_home_airport?: string;
  preferred_notification_time_start?: string;
  preferred_notification_time_end?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PreferenceUpdateRequest {
  timezone?: string;
  currency?: string;
  default_home_airport?: string;
  preferred_notification_time_start?: string;
  preferred_notification_time_end?: string;
}