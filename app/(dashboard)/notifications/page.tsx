'use client';

import {
  ConnectionStatus,
  Instructions,
  MessageInput,
  MessageList,
  QuickActions,
} from '@/components/websocket-test';
import { useWebSocketTest } from '@/hooks';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@saint-giong/bamboo-ui';
import { Activity, Bell, Settings } from 'lucide-react';
import {
  NotificationList,
  NotificationPreferencesForm,
  NotificationsHeader,
  useNotifications,
} from './_components';

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    preferences,
    isSaving,
    hasMore,
    isLoadingMore,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    handleClearAll,
    updatePreference,
    handleSavePreferences,
    addNotification,
    handleLoadMore,
  } = useNotifications();

  const {
    isConnected,
    socketId,
    messages,
    sendCustomMessage,
    triggerTestNotification: originalTriggerTestNotification,
    clearMessages,
  } = useWebSocketTest();

  // Wrapper to also add to notifications list
  const triggerTestNotification = () => {
    originalTriggerTestNotification();
    addNotification({
      type: 'system',
      title: 'WebSocket Test Notification',
      message: 'This is a test notification triggered from WebSocket.',
    });
  };

  const handleSendCustomMessage = (message: string) => {
    sendCustomMessage(message);
    addNotification({
      type: 'system',
      title: 'WebSocket Message Sent',
      message: message,
    });
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <NotificationsHeader
        unreadCount={unreadCount}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
        hasNotifications={notifications.length > 0}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">All Notifications</span>
                <span className="sm:hidden">All</span>
              </TabsTrigger>
              <TabsTrigger value="test" className="gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">WebSocket Test</span>
                <span className="sm:hidden">Test</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Preferences</span>
                <span className="sm:hidden">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <NotificationList
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
              />
            </TabsContent>

            <TabsContent value="test" className="space-y-4">
              <ConnectionStatus isConnected={isConnected} socketId={socketId} />

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-4 rounded-lg bg-white p-4 shadow">
                  <QuickActions
                    isConnected={isConnected}
                    onTriggerNotification={triggerTestNotification}
                    onClearMessages={clearMessages}
                  />
                  <MessageInput
                    isConnected={isConnected}
                    onSendMessage={handleSendCustomMessage}
                  />
                  <Instructions />
                </div>

                <MessageList messages={messages} />
              </div>
            </TabsContent>

            <TabsContent value="preferences">
              <NotificationPreferencesForm
                preferences={preferences}
                isSaving={isSaving}
                onUpdatePreference={updatePreference}
                onSave={handleSavePreferences}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
