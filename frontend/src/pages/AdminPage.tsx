import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  Flight as FlightIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { AdminDashboardStats, UserManagement, FlightManagement, AdminNotification } from '../types';
import AdminLayout from '../components/AdminLayout';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

const AdminPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [flights, setFlights] = useState<FlightManagement[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'user' | 'flight'>('user');
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    // Simulate loading admin data
    setTimeout(() => {
      setStats({
        totalUsers: 1250,
        totalFlights: 89,
        activeBookings: 456,
        revenue: 125000,
        currency: 'EUR',
        recentBookings: 23,
        pendingApprovals: 5
      });

      setUsers([
        {
          id: '1',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          status: 'active',
          createdAt: '2024-01-15',
          lastLogin: '2024-01-20',
          totalBookings: 12
        },
        {
          id: '2',
          email: 'jane.smith@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'admin',
          status: 'active',
          createdAt: '2024-01-10',
          lastLogin: '2024-01-19',
          totalBookings: 0
        }
      ]);

      setFlights([
        {
          id: '1',
          airline: 'Air France',
          airlineLogo: '/air-france-logo.png',
          departureAirport: 'CDG',
          arrivalAirport: 'JFK',
          departureTime: '2024-01-25T10:00:00',
          arrivalTime: '2024-01-25T13:00:00',
          duration: '3h 00m',
          price: 450,
          currency: 'EUR',
          stops: 0,
          prediction: {
            trend: 'up',
            confidence: 85,
            recommendation: 'Price expected to increase'
          },
          status: 'active',
          createdAt: '2024-01-20',
          updatedAt: '2024-01-20',
          createdBy: 'admin-1',
          capacity: 180,
          bookedSeats: 156
        }
      ]);

      setNotifications([
        {
          id: '1',
          type: 'warning',
          title: 'Low Capacity Alert',
          message: 'Flight AF123 is at 87% capacity',
          timestamp: '2024-01-20T14:30:00',
          isRead: false,
          priority: 'medium'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = (item: any, type: 'user' | 'flight') => {
    setEditingItem(item);
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleDelete = (id: string, type: 'user' | 'flight') => {
    if (type === 'user') {
      setUsers(users.filter(user => user.id !== id));
    } else {
      setFlights(flights.filter(flight => flight.id !== id));
    }
  };

  const handleSave = () => {
    // Handle save logic here
    setOpenDialog(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ py: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DashboardIcon color="primary" />
          Admin Dashboard
        </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4">
                    {stats?.totalUsers.toLocaleString()}
                  </Typography>
                </Box>
                <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Flights
                  </Typography>
                  <Typography variant="h4">
                    {stats?.totalFlights}
                  </Typography>
                </Box>
                <FlightIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Bookings
                  </Typography>
                  <Typography variant="h4">
                    {stats?.activeBookings}
                  </Typography>
                </Box>
                <NotificationsIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Revenue
                  </Typography>
                  <Typography variant="h4">
                    {stats?.currency} {stats?.revenue.toLocaleString()}
                  </Typography>
                </Box>
                <MoneyIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
            <Tab label="Users" {...a11yProps(0)} />
            <Tab label="Flights" {...a11yProps(1)} />
            <Tab label="Notifications" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Users Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">User Management</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setDialogType('user');
                setEditingItem(null);
                setOpenDialog(true);
              }}
            >
              Add User
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total Bookings</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={user.role === 'admin' ? 'warning' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={user.status === 'active' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.totalBookings}</TableCell>
                    <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(user, 'user')} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(user.id, 'user')} size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Flights Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Flight Management</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setDialogType('flight');
                setEditingItem(null);
                setOpenDialog(true);
              }}
            >
              Add Flight
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Airline</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flights.map((flight) => (
                  <TableRow key={flight.id}>
                    <TableCell>{flight.airline}</TableCell>
                    <TableCell>{`${flight.departureAirport} → ${flight.arrivalAirport}`}</TableCell>
                    <TableCell>{flight.departureTime}</TableCell>
                    <TableCell>{`${flight.currency} ${flight.price}`}</TableCell>
                    <TableCell>
                      <Chip
                        label={flight.status}
                        color={flight.status === 'active' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{`${flight.bookedSeats}/${flight.capacity}`}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(flight, 'flight')} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(flight.id, 'flight')} size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>System Notifications</Typography>
          {notifications.map((notification) => (
            <Alert
              key={notification.id}
              severity={notification.type}
              sx={{ mb: 2 }}
              action={
                <Button color="inherit" size="small">
                  Mark as Read
                </Button>
              }
            >
              <Typography variant="subtitle2">{notification.title}</Typography>
              <Typography variant="body2">{notification.message}</Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(notification.timestamp).toLocaleString()}
              </Typography>
            </Alert>
          ))}
        </TabPanel>
      </Paper>

      {/* Edit/Add Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? `Edit ${dialogType === 'user' ? 'User' : 'Flight'}` : `Add New ${dialogType === 'user' ? 'User' : 'Flight'}`}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'user' ? (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                defaultValue={editingItem?.firstName || ''}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Last Name"
                defaultValue={editingItem?.lastName || ''}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                defaultValue={editingItem?.email || ''}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select defaultValue={editingItem?.role || 'user'} label="Role">
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="super_admin">Super Admin</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select defaultValue={editingItem?.status || 'active'} label="Status">
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Box>
          ) : (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Airline"
                defaultValue={editingItem?.airline || ''}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Departure Airport"
                defaultValue={editingItem?.departureAirport || ''}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Arrival Airport"
                defaultValue={editingItem?.arrivalAirport || ''}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Price"
                type="number"
                defaultValue={editingItem?.price || ''}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select defaultValue={editingItem?.status || 'active'} label="Status">
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default AdminPage;
