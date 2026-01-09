'use client';

import {
  ConnectionStatus,
  Instructions,
  MessageInput,
  MessageList,
  QuickActions,
} from '@/components/websocket-test';
import { useWebSocketTest } from '@/hooks';

export default function TestWebSocketPage() {
  const {
    isConnected,
    socketId,
    messages,
    sendCustomMessage,
    triggerTestNotification,
    clearMessages,
  } = useWebSocketTest();

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50 p-4">
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-4">
        <ConnectionStatus isConnected={isConnected} socketId={socketId} />

        <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow">
            <QuickActions
              isConnected={isConnected}
              onTriggerNotification={triggerTestNotification}
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
