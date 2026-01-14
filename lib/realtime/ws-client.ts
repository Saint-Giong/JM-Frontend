import { io, type Socket } from 'socket.io-client';
import { DEFAULT_API_BASE_URL } from '../api/config';

/**
 * Low-level WebSocket client using socket.io-client.
 * Handles connection, reconnection, and basic event management.
 * Connection is optional - gracefully handles cases where WS server is unavailable.
 */
class WSClient {
  private socket: Socket | null = null;
  private baseUrl: string;
  private isEnabled: boolean;
  private connectionAttempted: boolean = false;

  constructor() {
    // Check if WebSocket is enabled (opt-in via environment variable)
    this.isEnabled = process.env.NEXT_PUBLIC_ENABLE_WS === 'true';

    // Use the same base URL as the API, but socket.io handles the protocol
    // Support local mock server for testing
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK_WS === 'true';
    this.baseUrl = 'https://sgjm-api.vohoangphuc.com';
    // useMock
    //   ? 'http://localhost:4000'
    //   : process.env.NEXT_PUBLIC_WS_URL || 'https://localhost:8072';
  }

  /**
   * Initialize and connect the WebSocket.
   * Returns null if WebSocket is disabled or unavailable.
   */
  connect(): Socket | null {
    // Skip connection if WS is disabled
    if (!this.isEnabled) {
      if (!this.connectionAttempted) {
        console.log(
          '[WS] WebSocket is disabled. Set NEXT_PUBLIC_ENABLE_WS=true to enable.'
        );
        this.connectionAttempted = true;
      }
      return null;
    }

    if (this.socket?.connected) {
      return this.socket;
    }

    try {
      this.socket = io(this.baseUrl, {
        path: '/socket.io',
        withCredentials: true,
        // Use websocket only to avoid CORS issues with polling
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
        // Only log once to avoid console spam
        if (!this.connectionAttempted) {
          console.warn(
            '[WS] Connection failed (server may be unavailable):',
            error.message
          );
          this.connectionAttempted = true;
        }
      });

      return this.socket;
    } catch (error: any) {
      console.warn('[WS] Failed to initialize WebSocket:', error);
      return null;
    }
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

  /**
   * Check if WebSocket is enabled.
   */
  isWebSocketEnabled(): boolean {
    return this.isEnabled;
  }
}

export const wsClient = new WSClient();
