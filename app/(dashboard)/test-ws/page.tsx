'use client';

import { useWebSocketTest } from '@/hooks';
import {
  ConnectionStatus,
  QuickActions,
  MessageInput,
  Instructions,
  MessageList,
} from '@/components/websocket-test';

export default function TestWebSocketPage() {
  const {
    isConnected,
    socketId,
    messages,
    sendCustomMessage,
    triggerTestNotification,
    markNotificationRead,
    clearMessages,
  } = useWebSocketTest();

  return (
    <div className="h-screen w-full bg-gray-50 p-4 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto flex flex-col gap-4">
        <ConnectionStatus isConnected={isConnected} socketId={socketId} />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-4">
            <QuickActions
              isConnected={isConnected}
              onTriggerNotification={triggerTestNotification}
              onMarkRead={markNotificationRead}
              onClearMessages={clearMessages}
            />
            <MessageInput
              isConnected={isConnected}
              onSendMessage={sendCustomMessage}
            />
            <Instructions />
          </div>

          <MessageList messages={messages} />
        </div>
      </div>
    </div>
  );
}
