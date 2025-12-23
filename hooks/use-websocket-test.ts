import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export type Message = {
  id: string;
  type: 'sent' | 'received' | 'notification' | 'system';
  content: string;
  timestamp: string;
  data?: any;
};

export function useWebSocketTest(serverUrl: string = 'http://localhost:4000') {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Connect to WebSocket server
    const socketInstance = io(serverUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      setSocketId(socketInstance.id || '');
      addMessage({
        type: 'system',
        content: 'Connected to WebSocket server',
        data: { socketId: socketInstance.id },
      });
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      setSocketId('');
      addMessage({
        type: 'system',
        content: 'Disconnected from WebSocket server',
      });
    });

    // Listen for notifications
    socketInstance.on('notification', (data) => {
      addMessage({
        type: 'notification',
        content: `${data.title}: ${data.message}`,
        data,
      });
    });

    // Listen for test message responses
    socketInstance.on('test:message:response', (data) => {
      addMessage({
        type: 'received',
        content: `Echo: ${data.echo}`,
        data,
      });
    });

    // Listen for matching applicant events
    socketInstance.on('matching_applicant', (data) => {
      addMessage({
        type: 'notification',
        content: `Matching Applicant: ${data.name} - ${data.role} (Score: ${data.matchScore})`,
        data,
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [serverUrl]);

  const addMessage = (msg: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      ...msg,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const sendCustomMessage = (message: string) => {
    if (!socket || !message.trim()) return;

    addMessage({
      type: 'sent',
      content: message,
      data: { message },
    });

    socket.emit('test:message', {
      message,
      sentAt: new Date().toISOString(),
    });
  };

  const triggerTestNotification = () => {
    if (!socket) return;

    addMessage({
      type: 'sent',
      content: 'Triggering test notification',
    });

    socket.emit('test:notification');
  };

  const markNotificationRead = (id: string) => {
    if (!socket) return;

    addMessage({
      type: 'sent',
      content: `Marking notification ${id} as read`,
    });

    socket.emit('notification:read', { id });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    isConnected,
    socketId,
    messages,
    sendCustomMessage,
    triggerTestNotification,
    markNotificationRead,
    clearMessages,
  };
}
