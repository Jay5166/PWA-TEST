import { BusinessSettings, NotificationItem, ChatMessage } from '../types';

export const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'ABC Digital Solutions',
  tagline: 'Your End-to-End Technology & Digital Growth Partner',
  appName: 'ABC Business AI',
  phone: '+91 90000 00000',
  email: 'hello@example.com',
  address: 'Tech Park Tower B, Suite 402, Innovation Hub',
  website: 'https://example.com',
  primaryColor: '#2563eb',
  secondaryColor: '#0ea5e9'
};

export const DEFAULT_KNOWLEDGE_BASE = `BUSINESS NAME:
ABC Digital Solutions

ABOUT US:
We are a premier digital agency that crafts high-performance web applications, mobile apps, and data-driven marketing campaigns. Founded in 2020, we have helped over 150 clients scale their digital presence.

SERVICES:
1. Website Development: Custom web apps, responsive websites, Next.js, React, Node.js.
2. Mobile App Development: iOS & Android progressive web apps and native applications.
3. Search Engine Optimization (SEO): Technical SEO, keyword research, on-page optimization.
4. Digital Marketing: Social media marketing, paid search campaigns, conversion rate optimization.
5. E-commerce Development: Custom online stores, payment integrations, catalog management.

ADDRESS:
Tech Park Tower B, Suite 402, Innovation Hub, Bangalore / Global Remote

PHONE:
+91 90000 00000

EMAIL:
hello@example.com

BUSINESS HOURS:
Monday - Friday: 10:00 AM - 7:00 PM
Saturday: 10:00 AM - 2:00 PM (Emergency Support Only)
Sunday: Closed

PRICING & PACKAGES:
- Starter Website Package: Starting at $999
- Custom Mobile App: Starting at $2,499
- Monthly SEO & Marketing Retainer: Starting at $650/month
- Free 30-minute discovery consultation for all new clients.

SPECIAL OFFERS:
- 20% off web development services for first-time clients this month.
- Free security audit and SEO scan with any custom project quote.

PAYMENT METHODS:
We accept Credit/Debit Cards (Visa, Mastercard, Amex), Wire Transfer, UPI, Stripe, and PayPal. Standard milestones: 50% deposit, 50% on project delivery.

SUPPORT & POLICIES:
- All completed projects include 30 days of complimentary technical support and bug fixes.
- Response time for client queries is typically within 2-4 business hours.
- Refund policy: Deposit is refundable within 7 days prior to design phase approval.

FAQ:
Q: How long does a standard website take to build?
A: Typically 2 to 4 weeks depending on scope and client asset readiness.

Q: Do you offer post-launch maintenance?
A: Yes, we provide monthly maintenance and hosting management plans starting at $99/mo.

Q: Can we schedule a virtual meeting?
A: Yes, email hello@example.com or call +91 90000 00000 to book a discovery call.`;

export const STORAGE_KEYS = {
  KNOWLEDGE_BASE: 'business_knowledge_base',
  KNOWLEDGE_BASE_UPDATED: 'business_knowledge_base_updated',
  SETTINGS: 'business_settings',
  NOTIFICATIONS: 'notification_history',
  CHAT_HISTORY: 'chat_history',
  ADMIN_AUTH: 'prototype_admin_auth'
};

export const StorageService = {
  getSettings(): BusinessSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch (e) {
      console.warn('Error reading settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: BusinessSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  },

  getKnowledgeBase(): { content: string; lastUpdated: string } {
    try {
      const content = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_BASE);
      const lastUpdated = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_BASE_UPDATED);
      return {
        content: content !== null ? content : DEFAULT_KNOWLEDGE_BASE,
        lastUpdated: lastUpdated || '7 October 2026, 6:30 PM'
      };
    } catch (e) {
      return { content: DEFAULT_KNOWLEDGE_BASE, lastUpdated: '7 October 2026, 6:30 PM' };
    }
  },

  saveKnowledgeBase(content: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_BASE, content);
      const now = new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_BASE_UPDATED, now);
    } catch (e) {
      console.error('Error saving knowledge base', e);
    }
  },

  getNotifications(): NotificationItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading notifications', e);
    }
    return [
      {
        id: 'notif_welcome',
        title: 'Welcome to ABC Digital Solutions',
        message: 'Thank you for connecting with us! Ask our AI any questions about our services or business hours.',
        sentAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        status: 'Sent',
        recipientsCount: 1
      },
      {
        id: 'notif_promo',
        title: 'New Weekend Offer',
        message: 'Get 20% off all website and mobile app packages this weekend!',
        actionText: 'View Services',
        sentAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: 'Sent',
        recipientsCount: 1
      }
    ];
  },

  addNotification(item: NotificationItem): void {
    try {
      const current = this.getNotifications();
      const updated = [item, ...current];
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving notification', e);
    }
  },

  clearNotifications(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    } catch (e) {
      console.error('Error clearing notifications', e);
    }
  },

  getChatHistory(): ChatMessage[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading chat history', e);
    }
    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: 'Hello! I am the official AI assistant for ABC Digital Solutions. How can I assist you with our services, business hours, or pricing today?',
        timestamp: new Date().toISOString()
      }
    ];
  },

  saveChatHistory(history: ChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Error saving chat history', e);
    }
  },

  clearChatHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    } catch (e) {
      console.error('Error clearing chat history', e);
    }
  },

  isAdminAuthenticated(): boolean {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch (e) {
      return false;
    }
  },

  setAdminAuthenticated(auth: boolean): void {
    try {
      if (auth) {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      }
    } catch (e) {}
  }
};
