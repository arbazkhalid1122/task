// Client-side Socket.IO setup
'use client';

import { io, Socket } from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';

let socketInstance: Socket | null = null;

export function getSocket(): Socket | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!socketInstance) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin;
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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const socketInstance = getSocket();
    if (!socketInstance) {
      return;
    }

    socketRef.current = socketInstance;
    setSocket(socketInstance);
    setIsConnected(socketInstance.connected);

    // Update connection state
    const handleConnect = () => {
      console.log('✅ useSocket: Socket connected, ID:', socketInstance?.id);
      setIsConnected(true);
    };

    const handleDisconnect = (reason: string) => {
      console.log('❌ useSocket: Socket disconnected, reason:', reason);
      setIsConnected(false);
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);

    // If already connected, set state immediately
    if (socketInstance.connected) {
      setIsConnected(true);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect', handleConnect);
        socketRef.current.off('disconnect', handleDisconnect);
      }
    };
  }, []);

  return { socket, isConnected };
}
