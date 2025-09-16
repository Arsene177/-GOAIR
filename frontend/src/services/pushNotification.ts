import { deviceTokenService } from './deviceToken';

class PushNotificationService {
  private static instance: PushNotificationService;
  private registration?: ServiceWorkerRegistration;
  private vapidKey?: string;

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async initialize(): Promise<void> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Push notifications are not supported');
    }

    try {
      // Get VAPID key from backend
      this.vapidKey = await deviceTokenService.getVapidKey();

      // Register service worker
      this.registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered');

      // Check existing permission
      const permission = await this.checkPermission();
      if (permission === 'granted') {
        await this.subscribeToPushManager();
      }
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      throw error;
    }
  }

  async checkPermission(): Promise<NotificationPermission> {
    return Notification.permission;
  }

  async requestPermission(): Promise<NotificationPermission> {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await this.subscribeToPushManager();
    }
    return permission;
  }

  private async subscribeToPushManager(): Promise<void> {
    if (!this.registration || !this.vapidKey) {
      throw new Error('Push notification service not properly initialized');
    }

    try {
      let subscription = await this.registration.pushManager.getSubscription();
      
      if (!subscription) {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.vapidKey)
        };
        
        subscription = await this.registration.pushManager.subscribe(subscribeOptions);
        
        // Register the subscription with our backend
        await deviceTokenService.registerToken(JSON.stringify(subscription));
      }
    } catch (error) {
      console.error('Failed to subscribe to push manager:', error);
      throw error;
    }
  }

  async unsubscribe(): Promise<void> {
    if (!this.registration) {
      return;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        await deviceTokenService.unregisterToken(JSON.stringify(subscription));
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      throw error;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const pushNotificationService = PushNotificationService.getInstance();