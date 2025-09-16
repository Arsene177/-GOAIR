import api from './api';
import { UserPreference, PreferenceUpdateRequest } from '../types/preferences';

export const preferencesService = {
  // Get user preferences
  getPreferences: async (): Promise<UserPreference> => {
    try {
      const response = await api.get('/preferences');
      return response.data;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
  },

  // Update user preferences
  updatePreferences: async (preferences: PreferenceUpdateRequest): Promise<UserPreference> => {
    try {
      const response = await api.put('/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  },

  // Reset preferences to default
  resetPreferences: async (): Promise<void> => {
    try {
      await api.delete('/preferences');
    } catch (error) {
      console.error('Error resetting preferences:', error);
      throw error;
    }
  }
};