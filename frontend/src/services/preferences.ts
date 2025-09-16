import axios from 'axios';
import { UserPreference, PreferenceUpdateRequest } from '../types/preferences';

const API_URL = 'http://localhost:8000/api';

export const PreferencesService = {
  async getUserPreferences(): Promise<UserPreference> {
    const response = await axios.get(`${API_URL}/preferences`, {
      withCredentials: true,
    });
    return response.data;
  },

  async updatePreferences(preferences: PreferenceUpdateRequest): Promise<UserPreference> {
    const response = await axios.put(`${API_URL}/preferences`, preferences, {
      withCredentials: true,
    });
    return response.data;
  },
};