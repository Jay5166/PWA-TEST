import React, { useState, useEffect } from 'react';
import { ActiveTab, AdminTab, BusinessSettings, NotificationItem } from './types';
import { StorageService } from './utils/storage';
import { PushClient } from './utils/push';
import { ToastProvider, useToast } from './components/Toast';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Navigation } from './components/Navigation';

// Customer Views
import { HomeView } from './views/HomeView';
import { ChatView } from './views/ChatView';
import { NotificationsView } from './views/NotificationsView';
import { BusinessInfoView } from './views/BusinessInfoView';

// Admin Views
import { AdminLoginView } from './views/AdminLoginView';
import { AdminLayout } from './views/admin/AdminLayout';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { AdminKnowledgeBase } from './views/admin/AdminKnowledgeBase';
import { AdminAIAssistant } from './views/admin/AdminAIAssistant';
import { AdminSendNotification } from './views/admin/AdminSendNotification';
import { AdminNotificationHistory } from './views/admin/AdminNotificationHistory';
import { AdminSubscribers } from './views/admin/AdminSubscribers';
import { AdminQRCode } from './views/admin/AdminQRCode';
import { AdminSettings } from './views/admin/AdminSettings';

function AppContent() {
  const { showToast } = useToast();

  // State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    StorageService.isAdminAuthenticated()
  );

  const [settings, setSettings] = useState<BusinessSettings>(() =>
    StorageService.getSettings()
  );

  const [knowledgeBase, setKnowledgeBase] = useState<string>(() =>
    StorageService.getKnowledgeBase().content
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    StorageService.getNotifications()
  );

  // Register service worker passively on mount
  useEffect(() => {
    if (PushClient.isSupported()) {
      PushClient.registerServiceWorker().catch((err) => {
        console.warn('Service worker registration note:', err);
      });
    }

    // Listen for incoming broadcast messages from service worker
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PUSH_RECEIVED' && event.data.payload) {
        const item: NotificationItem = {
          id: `push_${Date.now()}`,
          title: event.data.payload.title,
          message: event.data.payload.body,
          image: event.data.payload.image,
          url: event.data.payload.url,
          sentAt: event.data.payload.date || new Date().toISOString(),
          status: 'Delivered',
          recipientsCount: 1
        };
        StorageService.addNotification(item);
        setNotifications((prev) => [item, ...prev]);
        showToast(`🔔 ${item.title}: ${item.message}`, 'info');
      } else if (event.data?.type === 'NAVIGATE_TO') {
        const target = event.data.url;
        if (target.includes('assistant') || target.includes('chat')) {
          setActiveTab('chat');
        } else if (target.includes('notifications') || target.includes('alerts')) {
          setActiveTab('notifications');
        }
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, [showToast]);

  const handleAdminLogout = () => {
    StorageService.setAdminAuthenticated(false);
    setIsAdminAuthenticated(false);
    setActiveTab('home');
    showToast('Admin session ended', 'info');
  };

  const handleNotificationSent = (item: NotificationItem) => {
    setNotifications((prev) => [item, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Offline Alert Strip */}
      <OfflineIndicator />

      {/* When in Admin tab and authenticated: Render Full Admin Layout */}
      {activeTab === 'admin' ? (
        isAdminAuthenticated ? (
          <AdminLayout
            currentTab={adminTab}
            setCurrentTab={setAdminTab}
            onLogout={handleAdminLogout}
            onReturnToPWA={() => setActiveTab('home')}
            settings={settings}
          >
            {adminTab === 'dashboard' && (
              <AdminDashboard
                setCurrentTab={setAdminTab}
                settings={settings}
                knowledgeBase={knowledgeBase}
                notifications={notifications}
              />
            )}
            {adminTab === 'knowledge-base' && (
              <AdminKnowledgeBase
                knowledgeBase={knowledgeBase}
                setKnowledgeBase={setKnowledgeBase}
                setCurrentTab={setAdminTab}
              />
            )}
            {adminTab === 'ai-assistant' && (
              <AdminAIAssistant knowledgeBase={knowledgeBase} />
            )}
            {adminTab === 'notifications' && (
              <AdminSendNotification
                onNotificationSent={handleNotificationSent}
                setCurrentTab={setAdminTab}
              />
            )}
            {adminTab === 'history' && (
              <AdminNotificationHistory
                notifications={notifications}
                setNotifications={setNotifications}
                setCurrentTab={setAdminTab}
              />
            )}
            {adminTab === 'subscribers' && <AdminSubscribers />}
            {adminTab === 'qr-code' && <AdminQRCode />}
            {adminTab === 'settings' && (
              <AdminSettings settings={settings} setSettings={setSettings} />
            )}
          </AdminLayout>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <AdminLoginView
              onSuccess={() => setIsAdminAuthenticated(true)}
              onCancel={() => setActiveTab('home')}
            />
          </div>
        )
      ) : (
        /* Customer-Facing Progressive Web App */
        <div className="flex-1 flex flex-col">
          <Navigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            settings={settings}
            unreadNotificationsCount={notifications.length}
            isAdminAuthenticated={isAdminAuthenticated}
          />

          <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6">
            {activeTab === 'home' && (
              <HomeView
                settings={settings}
                setActiveTab={setActiveTab}
                knowledgeBaseSummary={knowledgeBase}
              />
            )}

            {activeTab === 'chat' && (
              <ChatView settings={settings} knowledgeBase={knowledgeBase} />
            )}

            {activeTab === 'notifications' && (
              <NotificationsView
                notifications={notifications}
                setNotifications={setNotifications}
              />
            )}

            {activeTab === 'info' && (
              <BusinessInfoView
                settings={settings}
                knowledgeBase={knowledgeBase}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
