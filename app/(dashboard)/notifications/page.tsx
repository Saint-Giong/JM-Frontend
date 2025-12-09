'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@saint-giong/bamboo-ui';
import { Bell, Settings } from 'lucide-react';
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
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    handleClearAll,
    updatePreference,
    handleSavePreferences,
  } = useNotifications();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <NotificationsHeader
        unreadCount={unreadCount}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">All Notifications</span>
                <span className="sm:hidden">All</span>
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
                onClearAll={handleClearAll}
              />
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
