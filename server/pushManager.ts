import dotenv from 'dotenv';
dotenv.config();

import webpush from 'web-push';

export interface SubscriberRecord {
  id: string;
  endpoint: string;
  subscription: webpush.PushSubscription;
  userAgent: string;
  browser: string;
  os: string;
  subscribedAt: string;
}

// In-memory subscription store for prototype
const subscriptionsMap = new Map<string, SubscriberRecord>();

// Initialize VAPID Keys
let vapidPublicKey = process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
let vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
let vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';
let isEphemeralKeys = false;

if (!vapidPublicKey || !vapidPrivateKey) {
  // Generate ephemeral VAPID keys for immediate prototype testing
  const generated = webpush.generateVAPIDKeys();
  vapidPublicKey = generated.publicKey;
  vapidPrivateKey = generated.privateKey;
  isEphemeralKeys = true;
  console.log('[Push] Generated ephemeral VAPID keys for demo/prototype.');
  console.log('[Push] Ephemeral Public Key:', vapidPublicKey);
}

try {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
  console.log('[Push] Web Push VAPID configured successfully.');
} catch (err) {
  console.error('[Push] Error configuring VAPID:', err);
}

function parseUserAgent(ua: string): { browser: string; os: string } {
  let browser = 'Browser';
  let os = 'Unknown OS';

  if (!ua) return { browser: 'Unknown Device', os: 'Mobile/Desktop' };

  if (/edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Google Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Mozilla Firefox';
  else if (/safari/i.test(ua)) browser = 'Apple Safari';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';

  if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  return { browser, os };
}

export const PushManager = {
  getVapidPublicKey: () => ({
    publicKey: vapidPublicKey,
    isEphemeral: isEphemeralKeys,
    subject: vapidSubject
  }),

  addSubscription: (subscription: webpush.PushSubscription, userAgent: string = '') => {
    if (!subscription || !subscription.endpoint) {
      throw new Error('Invalid subscription object');
    }

    const { browser, os } = parseUserAgent(userAgent);
    const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const record: SubscriberRecord = {
      id,
      endpoint: subscription.endpoint,
      subscription,
      userAgent,
      browser,
      os,
      subscribedAt: new Date().toISOString()
    };

    subscriptionsMap.set(subscription.endpoint, record);
    return {
      success: true,
      id,
      count: subscriptionsMap.size,
      record
    };
  },

  removeSubscription: (endpoint: string) => {
    const existed = subscriptionsMap.delete(endpoint);
    return {
      success: existed,
      count: subscriptionsMap.size
    };
  },

  getSubscribers: (): SubscriberRecord[] => {
    return Array.from(subscriptionsMap.values());
  },

  sendNotification: async (payload: {
    title: string;
    body: string;
    image?: string;
    url?: string;
    actionText?: string;
  }) => {
    const all = Array.from(subscriptionsMap.values());
    if (all.length === 0) {
      return {
        success: true,
        sentCount: 0,
        failedCount: 0,
        totalSubscribers: 0,
        message: 'No active subscribers connected in current prototype session.'
      };
    }

    const jsonPayload = JSON.stringify({
      title: payload.title || 'New Announcement',
      body: payload.body || '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      image: payload.image || null,
      url: payload.url || '/',
      actionText: payload.actionText || 'Open App',
      date: new Date().toISOString(),
      id: Date.now().toString()
    });

    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    await Promise.all(
      all.map(async (record) => {
        try {
          await webpush.sendNotification(record.subscription, jsonPayload, {
            TTL: 60 * 60 * 24 // 24 hours
          });
          sentCount++;
        } catch (err: any) {
          failedCount++;
          errors.push(`Endpoint error: ${err.message || 'Unknown push error'}`);
          // Remove unsubscribed/expired endpoints (HTTP 410 or 404)
          if (err.statusCode === 410 || err.statusCode === 404) {
            subscriptionsMap.delete(record.endpoint);
          }
        }
      })
    );

    return {
      success: sentCount > 0 || all.length === 0,
      sentCount,
      failedCount,
      totalSubscribers: all.length,
      errors: errors.slice(0, 3)
    };
  }
};
