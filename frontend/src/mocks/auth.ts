import { AuthResponse, User } from '../types';

export const mockUser: User = {
  id: 'user_123',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe'
};

export const mockAuthResponse: AuthResponse = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzUyOTI5NjAsImV4cCI6MTczNTM3OTM2MH0.mock_token',
  user: mockUser,
  expiresIn: 86400 // 24 heures
};

export const mockLoginResponse = {
  success: true,
  data: mockAuthResponse,
  message: 'Connexion réussie'
};

export const mockRegisterResponse = {
  success: true,
  data: mockAuthResponse,
  message: 'Inscription réussie'
}; 