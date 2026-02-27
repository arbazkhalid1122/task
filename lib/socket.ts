// Client-side Socket.IO – connects to backend (e.g. Railway). Set NEXT_PUBLIC_SOCKET_URL to backend URL.
'use client';

import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

let socketInstance: Socket | null = null;

export function getSocket(): Socket | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!socketInstance) {
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      window.location.origin;
    console.log('🔌 Initializing socket connection to:', socketUrl);
    socketInstance = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: Infinity, // Keep trying to reconnect
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false,
      autoConnect: true,
    });

    // Set up global connection handlers
    socketInstance.on('connect', () => {
      console.log('✅ Socket connected, ID:', socketInstance?.id);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected, reason:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
    });

    socketInstance.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Reconnection attempt', attemptNumber);
    });

    socketInstance.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error);
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed');
    });
  }

  return socketInstance;
}

export function useSocket() {
  const [socket] = useState<Socket | null>(() =>
    typeof window === 'undefined' ? null : getSocket(),
  );
  const [isConnected, setIsConnected] = useState(socket?.connected ?? false);

  useEffect(() => {
    if (!socket) {
      return;
    }

    // Update connection state
    const handleConnect = () => {
      console.log('✅ useSocket: Socket connected, ID:', socket?.id);
      setIsConnected(true);
    };

    const handleDisconnect = (reason: string) => {
      console.log('❌ useSocket: Socket disconnected, reason:', reason);
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket]);

  return { socket, isConnected };
}
