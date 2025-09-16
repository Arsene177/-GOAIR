import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface DeviceToken {
  token: string;
  device_type: string;
}

export const deviceTokenService = {
  async registerToken(token: string): Promise<void> {
    await axios.post(`${API_URL}/notifications/register-device`, {
      token,
      device_type: 'web'
    }, {
      withCredentials: true
    });
  },

  async unregisterToken(token: string): Promise<void> {
    await axios.post(`${API_URL}/notifications/unregister-device`, {
      token
    }, {
      withCredentials: true
    });
  },

  async getVapidKey(): Promise<string> {
    const response = await axios.get(`${API_URL}/notifications/vapid-key`, {
      withCredentials: true
    });
    return response.data.vapidKey;
  }
};