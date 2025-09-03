# GOAIR Admin Portal

## Overview

The GOAIR Admin Portal is a comprehensive administrative interface that provides system administrators with tools to manage users, flights, system settings, and monitor system performance.

## Features

### 🔐 Authentication
- **Admin Login**: Secure admin-only access with dedicated login page
- **Role-based Access**: Support for admin and super admin roles
- **Session Management**: Configurable session timeouts and security

### 📊 Dashboard
- **Statistics Overview**: Real-time metrics for users, flights, bookings, and revenue
- **Quick Actions**: Fast access to common administrative tasks
- **System Status**: Current system health and performance indicators

### 👥 User Management
- **User Overview**: Complete list of registered users with detailed information
- **Role Management**: Assign and modify user roles (user, admin, super admin)
- **Status Control**: Activate, deactivate, or suspend user accounts
- **User Analytics**: Track user activity, bookings, and login history

### ✈️ Flight Management
- **Flight Operations**: Add, edit, and remove flight schedules
- **Capacity Management**: Monitor seat availability and booking status
- **Flight Status**: Control active, inactive, and cancelled flights
- **Route Management**: Manage departure and arrival airport configurations

### 🔔 Notifications
- **System Alerts**: Real-time notifications for system events
- **Priority Management**: Categorized notifications by importance
- **Alert History**: Track and manage notification history

### ⚙️ System Settings
- **General Configuration**: Maintenance mode, debug settings, user limits
- **Notification Preferences**: Email, SMS, and backup settings
- **Security Policies**: Password requirements, session security
- **Regional Settings**: Currency, timezone, and localization options

## Access

### Demo Credentials
- **Email**: `admin@goair.com`
- **Password**: `admin123`

### Access Points
1. **Main Site**: Click the "Admin" button in the header
2. **Direct URL**: Navigate to `/admin/login`
3. **Admin Dashboard**: After login, access via `/admin`

## Architecture

### Components
- **AdminLayout**: Consistent layout wrapper with sidebar navigation
- **AdminPage**: Main dashboard with statistics and management tabs
- **AdminLoginPage**: Secure authentication interface
- **AdminSettingsPage**: System configuration and settings

### Routing Structure
```
/admin/login          # Admin authentication
/admin               # Main admin dashboard
/admin/settings      # System configuration
/admin/users         # User management (planned)
/admin/flights       # Flight management (planned)
/admin/notifications # Notification center (planned)
```

### State Management
- **Local State**: Component-level state for UI interactions
- **Mock Data**: Simulated data for demonstration purposes
- **Form Handling**: Controlled inputs with validation

## Security Features

### Authentication
- Dedicated admin login system
- Role-based access control
- Session timeout management

### Data Protection
- CSRF protection
- Rate limiting
- HTTPS enforcement
- Input validation

## Customization

### Themes
- Material-UI based design system
- Consistent color scheme
- Responsive layout for all devices

### Configuration
- Modular component architecture
- Easy to extend and modify
- Configurable settings panel

## Development

### Prerequisites
- Node.js 16+
- React 18+
- Material-UI 5+
- TypeScript

### Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Access admin portal at `/admin/login`

### Adding New Features
1. Create new admin page component
2. Add route to `App.tsx`
3. Update navigation in `AdminLayout`
4. Implement required functionality

## Future Enhancements

### Planned Features
- **Advanced Analytics**: Detailed reporting and insights
- **Bulk Operations**: Mass user and flight management
- **API Integration**: Real backend connectivity
- **Audit Logs**: Complete system activity tracking
- **Multi-language Support**: Internationalization
- **Mobile App**: Native mobile admin interface

### Technical Improvements
- **State Management**: Redux or Zustand integration
- **Real-time Updates**: WebSocket connections
- **Offline Support**: Progressive Web App features
- **Performance**: Lazy loading and optimization

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

---

**Note**: This is a demonstration version of the admin portal. In production, implement proper authentication, authorization, and security measures.
