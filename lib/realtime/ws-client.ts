import { io, type Socket } from 'socket.io-client';
import { DEFAULT_API_BASE_URL } from '../api/config';

/**
 * Low-level WebSocket client using socket.io-client.
 * Handles connection, reconnection, and basic event management.
 */
class WSClient {
  private socket: Socket | null = null;
  private baseUrl: string;

  constructor() {
    // Use the same base URL as the API, but socket.io handles the protocol
    this.baseUrl = process.env.NEXT_PUBLIC_WS_URL || DEFAULT_API_BASE_URL;
  }

  /**
   * Initialize and connect the WebSocket.
   */
  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(this.baseUrl, {
      withCredentials: true,
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('[WS] Connected to', this.baseUrl);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[WS] Disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[WS] Connection error:', error);
    });

    return this.socket;
  }

  /**
   * Disconnect the WebSocket.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Get the current socket instance.
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if the socket is connected.
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsClient = new WSClient();
