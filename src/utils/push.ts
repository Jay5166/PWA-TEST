function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export interface PushStatus {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  error?: string;
}

export const PushClient = {
  isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'Notification' in window &&
      'PushManager' in window
    );
  },

  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  },

  async getExistingSubscription(): Promise<PushSubscription | null> {
    if (!this.isSupported()) return null;
    try {
      const reg = await navigator.serviceWorker.ready;
      return await reg.pushManager.getSubscription();
    } catch (err) {
      console.warn('Error checking existing push subscription:', err);
      return null;
    }
  },

  async getVapidPublicKey(): Promise<string> {
    // First check env variable
    const envKey = (import.meta as any).env?.VITE_VAPID_PUBLIC_KEY || 
                   (import.meta as any).env?.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (envKey) return envKey;

    // Fetch from backend endpoint
    try {
      const res = await fetch('/api/push/vapid-public-key');
      if (res.ok) {
        const data = await res.json();
        if (data.publicKey) return data.publicKey;
      }
    } catch (e) {
      console.warn('Could not fetch VAPID public key from server:', e);
    }
    return '';
  },

  async registerServiceWorker(): Promise<ServiceWorkerRegistration> {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported');
    }
    return await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  },

  async subscribeUser(): Promise<{ success: boolean; subscription?: PushSubscription; error?: string }> {
    if (!this.isSupported()) {
      return { success: false, error: 'Push notifications are not supported in this browser' };
    }

    try {
      // 1. Explicit user permission prompt (ONLY triggered on button click!)
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return {
          success: false,
          error: permission === 'denied' 
            ? 'Notifications are blocked. Please enable them in your browser site settings.'
            : 'Permission was not granted.'
        };
      }

      // 2. Register Service Worker if not yet registered
      await this.registerServiceWorker();
      const registration = await navigator.serviceWorker.ready;

      // 3. Get server VAPID key
      const vapidKey = await this.getVapidPublicKey();
      if (!vapidKey) {
        throw new Error('Failed to obtain VAPID public key from server');
      }

      const convertedKey = urlBase64ToUint8Array(vapidKey);

      // 4. Create Push Subscription
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey as unknown as BufferSource
        });
      }

      // 5. Send subscription to server
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription })
      });

      if (!response.ok) {
        throw new Error('Server rejected push subscription');
      }

      // Save local subscription marker
      localStorage.setItem('pwa_push_subscribed', 'true');

      return { success: true, subscription };
    } catch (err: any) {
      console.error('Subscription error:', err);
      return { success: false, error: err.message || 'Failed to enable notifications' };
    }
  },

  async unsubscribeUser(): Promise<boolean> {
    try {
      const subscription = await this.getExistingSubscription();
      if (subscription) {
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint })
        });
        await subscription.unsubscribe();
      }
      localStorage.removeItem('pwa_push_subscribed');
      return true;
    } catch (e) {
      console.warn('Error unsubscribing:', e);
      return false;
    }
  }
};
