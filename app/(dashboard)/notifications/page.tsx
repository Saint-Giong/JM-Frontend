'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  Separator,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@saint-giong/bamboo-ui';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Clock,
  Settings,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { useState } from 'react';

interface Notification {
  id: string;
  type: 'application' | 'match' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  applicantName?: string;
  jobTitle?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'application',
    title: 'New Application Received',
    message: 'has applied for your Social Media Manager position.',
    timestamp: '2 hours ago',
    read: false,
    applicantName: 'John Doe',
    jobTitle: 'Social Media Manager',
  },
  {
    id: '2',
    type: 'match',
    title: 'New Candidate Match',
    message:
      'matches your search criteria for Full-Stack Developer. View their profile to learn more.',
    timestamp: '5 hours ago',
    read: false,
    applicantName: 'Jane Smith',
  },
  {
    id: '3',
    type: 'application',
    title: 'New Application Received',
    message: 'has applied for your Frontend Developer position.',
    timestamp: '1 day ago',
    read: true,
    applicantName: 'Mike Johnson',
    jobTitle: 'Frontend Developer',
  },
  {
    id: '4',
    type: 'system',
    title: 'Subscription Expiring Soon',
    message:
      'Your premium subscription will expire in 7 days. Renew now to continue enjoying premium features.',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'match',
    title: 'New Candidate Match',
    message: 'matches your search criteria for Data Engineer.',
    timestamp: '3 days ago',
    read: true,
    applicantName: 'Sarah Williams',
  },
];

function NotificationIcon({ type }: { type: Notification['type'] }) {
  switch (type) {
    case 'application':
      return <User className="h-5 w-5" />;
    case 'match':
      return <Users className="h-5 w-5" />;
    case 'system':
      return <Bell className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [isSaving, setIsSaving] = useState(false);

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [applicationAlerts, setApplicationAlerts] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [systemNotifications, setSystemNotifications] = useState(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Bell className="h-6 w-6" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-2xl">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="rounded-full">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              Stay updated with your recruitment activity
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Mark all read</span>
            </Button>
          )}
        </div>
      </header>

      {/* Content */}
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

            {/* All Notifications Tab */}
            <TabsContent value="all">
              <Card>
                <CardContent className="p-0">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <BellOff className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">
                        No notifications
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        You&apos;re all caught up! Check back later for updates.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex gap-4 p-4 transition-colors hover:bg-muted/50 ${
                            !notification.read ? 'bg-primary/5' : ''
                          }`}
                        >
                          {/* Icon */}
                          <div
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                              !notification.read
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <NotificationIcon type={notification.type} />
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p
                                  className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}
                                >
                                  {notification.title}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  {notification.applicantName && (
                                    <span className="font-medium text-foreground">
                                      {notification.applicantName}{' '}
                                    </span>
                                  )}
                                  {notification.message}
                                </p>
                              </div>
                              {!notification.read && (
                                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                              )}
                            </div>
                            <div className="mt-2 flex items-center gap-4">
                              <span className="flex items-center gap-1 text-muted-foreground text-xs">
                                <Clock className="h-3 w-3" />
                                {notification.timestamp}
                              </span>
                              <div className="flex items-center gap-2">
                                {!notification.read && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleMarkAsRead(notification.id)
                                    }
                                    className="flex items-center gap-1 text-primary text-xs hover:underline"
                                  >
                                    <Check className="h-3 w-3" />
                                    Mark as read
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDelete(notification.id)}
                                  className="flex items-center gap-1 text-muted-foreground text-xs hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {notifications.length > 0 && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-muted-foreground"
                  >
                    Clear all notifications
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardContent className="space-y-6 p-6">
                  <div>
                    <h3 className="mb-4 font-semibold text-lg">
                      Email Notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="font-medium text-sm">
                            Email Notifications
                          </label>
                          <p className="text-muted-foreground text-sm">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="font-medium text-sm">
                            Weekly Digest
                          </label>
                          <p className="text-muted-foreground text-sm">
                            Receive a weekly summary of your recruitment
                            activity
                          </p>
                        </div>
                        <Switch
                          checked={weeklyDigest}
                          onCheckedChange={setWeeklyDigest}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-4 font-semibold text-lg">
                      Push Notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="font-medium text-sm">
                            Application Alerts
                          </label>
                          <p className="text-muted-foreground text-sm">
                            Get notified when someone applies to your job posts
                          </p>
                        </div>
                        <Switch
                          checked={applicationAlerts}
                          onCheckedChange={setApplicationAlerts}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="font-medium text-sm">
                            Candidate Match Alerts
                          </label>
                          <p className="text-muted-foreground text-sm">
                            Get notified when new candidates match your search
                            profiles (Premium)
                          </p>
                        </div>
                        <Switch
                          checked={matchAlerts}
                          onCheckedChange={setMatchAlerts}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="font-medium text-sm">
                            System Notifications
                          </label>
                          <p className="text-muted-foreground text-sm">
                            Important updates about your account and
                            subscription
                          </p>
                        </div>
                        <Switch
                          checked={systemNotifications}
                          onCheckedChange={setSystemNotifications}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSavePreferences} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
