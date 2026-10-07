export interface BusinessSettings {
  businessName: string;
  tagline: string;
  appName: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  image?: string;
  url?: string;
  actionText?: string;
  sentAt: string;
  status: 'Sent' | 'Delivered' | 'Failed';
  recipientsCount?: number;
}

export interface SubscriberItem {
  id: string;
  endpoint: string;
  browser: string;
  os: string;
  subscribedAt: string;
  userAgent: string;
}

export type ActiveTab = 'home' | 'chat' | 'notifications' | 'info' | 'admin';
export type AdminTab = 
  | 'dashboard' 
  | 'knowledge-base' 
  | 'ai-assistant' 
  | 'notifications' 
  | 'history' 
  | 'subscribers' 
  | 'qr-code' 
  | 'settings';
