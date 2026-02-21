type SocketRoomEmitter = {
  emit: (event: string, payload: unknown) => void;
};

type SocketServerLike = {
  to: (room: string) => SocketRoomEmitter;
};

declare global {
  // Shared in-process socket reference set by `lib/socket-server.js`.
  var __socketIO: SocketServerLike | undefined;
}

function getSocketIO(): SocketServerLike | null {
  return globalThis.__socketIO ?? null;
}

export function emitReviewCreated(review: unknown) {
  const io = getSocketIO();
  if (!io) {
    console.error('Socket.IO server not initialized! Cannot emit review:created event');
    return;
  }
  io.to('reviews').emit('review:created', review);
}

export function emitReviewUpdated(review: unknown) {
  const io = getSocketIO();
  if (!io) return;
  io.to('reviews').emit('review:updated', review);
}

export function emitReviewVoteUpdated(reviewId: string, helpfulCount: number, downVoteCount?: number) {
  const io = getSocketIO();
  if (!io) {
    console.error('Socket.IO server not initialized! Cannot emit review:vote:updated event');
    return;
  }
  io.to('reviews').emit('review:vote:updated', { 
    reviewId, 
    helpfulCount, 
    downVoteCount: downVoteCount ?? 0 
  });
}
