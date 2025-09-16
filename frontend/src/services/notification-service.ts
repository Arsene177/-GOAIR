import api from './api';

// Check if the browser supports push notifications
export const isPushNotificationSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw error;
  }
};

export const subscribeToNotifications = async () => {
  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    
    // Get push subscription
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
    });

    // Send subscription to backend
    await api.post('/notifications/subscribe', {
      subscription: subscription.toJSON()
    });

    return subscription;
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    throw error;
  }
};

export const unsubscribeFromNotifications = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      // Unsubscribe from push notifications
      await subscription.unsubscribe();
      
      // Notify backend
      await api.post('/notifications/unsubscribe', {
        subscription: subscription.toJSON()
      });
    }
  } catch (error) {
    console.error('Error unsubscribing from notifications:', error);
    throw error;
  }
};

export const getNotificationPermissionStatus = async () => {
  if (!isPushNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
};