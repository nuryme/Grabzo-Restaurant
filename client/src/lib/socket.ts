import { io, type Socket } from 'socket.io-client'

// Single shared connection. Same-origin in dev (Vite proxies /socket.io to the
// API); VITE_API_URL points at the Render URL in prod.
let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL ?? '', { autoConnect: true })
  }
  return socket
}
