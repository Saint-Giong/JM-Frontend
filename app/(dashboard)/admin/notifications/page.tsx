'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@saint-giong/bamboo-ui';
import { Send } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { buildEndpoint, fetchWithAuth } from '@/lib/api';
import { notificationApi } from '@/lib/api/notifications';
import { useAuthStore } from '@/stores';
import {
  AdminToolbar,
  type ColumnDef,
  DataTable,
  EntityDetailSheet,
  type PaginationState,
} from '../_components';

interface NotificationItem {
  notificationId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  companyId: string;
}

export default function NotificationsAdminPage() {
  const companyId = useAuthStore((state) => state.companyId);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);

  // Test notification form
  const [testCompanyId, setTestCompanyId] = useState(companyId || '');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!companyId) return;
    setIsLoading(true);
    try {
      const response = await notificationApi.getForCompany(
        companyId,
        page,
        pageSize
      );
      setNotifications(response.content);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [companyId, page, pageSize]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (companyId) {
      setTestCompanyId(companyId);
    }
  }, [companyId]);

  const handleMarkAsRead = async (notification: NotificationItem) => {
    try {
      await notificationApi.markAsRead(notification.notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDelete = async (notification: NotificationItem) => {
    try {
      await notificationApi.delete(notification.notificationId);
      setSelectedNotification(null);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const columns: ColumnDef<NotificationItem>[] = [
    {
      key: 'notificationId',
      header: 'ID',
      width: '180px',
      render: (value) => (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          {String(value).slice(0, 8)}...
        </code>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {!row.isRead && <span className="h-2 w-2 rounded-full bg-blue-500" />}
          <span
            className={row.isRead ? 'text-muted-foreground' : 'font-medium'}
          >
            {String(value)}
          </span>
        </div>
      ),
    },
    {
      key: 'message',
      header: 'Message',
      render: (value) => (
        <span className="line-clamp-1 max-w-xs text-muted-foreground text-sm">
          {String(value)}
        </span>
      ),
    },
    {
      key: 'isRead',
      header: 'Status',
      render: (value) => (
        <Badge
          variant="outline"
          className={
            value
              ? ''
              : 'border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400'
          }
        >
          {value ? 'Read' : 'Unread'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (value) =>
        value ? (
          new Date(String(value)).toLocaleString()
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
  ];

  const pagination: PaginationState = {
    page,
    size: pageSize,
    totalElements,
    totalPages,
  };

  return (
    <div className="flex h-full flex-col">
      <AdminToolbar
        title="Notifications"
        description="View and test notification system"
        onRefresh={fetchNotifications}
        isLoading={isLoading}
        totalCount={totalElements}
      />

      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Notification list */}
          <div className="lg:col-span-2">
            <DataTable
              columns={columns}
              data={notifications}
              isLoading={isLoading}
              pagination={pagination}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(0);
              }}
              onRowClick={setSelectedNotification}
              rowKey="notificationId"
              emptyMessage="No notifications found"
            />
          </div>

          {/* Test notification panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Test Notification
                </CardTitle>
                <CardDescription>
                  Send a test notification via Kafka
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyId">Target Company ID</Label>
                  <Input
                    id="companyId"
                    value={testCompanyId}
                    onChange={(e) => setTestCompanyId(e.target.value)}
                    placeholder="Enter company UUID"
                  />
                </div>
                <Button
                  className="w-full"
                  disabled={!testCompanyId || isSending}
                  onClick={async () => {
                    setIsSending(true);
                    setSendResult(null);
                    try {
                      // Note: This endpoint needs to be exposed on the backend
                      // POST /v1/noti/?type=NEW
                      const response = await fetchWithAuth(
                        buildEndpoint('noti/?type=NEW'),
                        {
                          method: 'POST',
                        }
                      );
                      if (response.ok) {
                        setSendResult('Test notification sent successfully!');
                        fetchNotifications();
                      } else {
                        setSendResult('Failed to send notification');
                      }
                    } catch {
                      setSendResult('Error: Could not connect to backend');
                    } finally {
                      setIsSending(false);
                    }
                  }}
                >
                  {isSending ? 'Sending...' : 'Send Test Notification'}
                </Button>
                {sendResult && (
                  <p
                    className={`text-sm ${
                      sendResult.includes('success')
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {sendResult}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EntityDetailSheet
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        title={selectedNotification?.title || 'Notification Details'}
        description={selectedNotification?.notificationId}
        entity={selectedNotification}
        actions={
          selectedNotification && (
            <>
              {!selectedNotification.isRead && (
                <Button
                  variant="outline"
                  onClick={() => handleMarkAsRead(selectedNotification)}
                >
                  Mark as Read
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={() => handleDelete(selectedNotification)}
              >
                Delete
              </Button>
            </>
          )
        }
      />
    </div>
  );
}
