import type { Server as HttpServer } from 'node:http'
import { Server } from 'socket.io'
import { env } from '../config/env.js'
import { verifyToken } from '../services/token.js'

let io: Server | null = null

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, { cors: { origin: env.clientOrigin } })

  io.on('connection', (socket) => {
    // Customers join their order's room to receive status/estimate updates. The
    // unguessable order id is the only thing needed — no account required.
    socket.on('order:join', (orderId: string) => socket.join(`order:${orderId}`))

    // The kitchen room carries every live order (with customer name/phone), so a
    // valid staff/owner token is required to join — never trust the client.
    socket.on('kitchen:join', (token?: string) => {
      try {
        const payload = verifyToken(String(token))
        if (payload.role === 'owner' || payload.role === 'staff') {
          socket.join('kitchen')
        }
      } catch {
        // Invalid/absent token — silently refuse to join the kitchen room.
      }
    })
  })

  return io
}

export function getIo(): Server {
  if (!io) throw new Error('Socket.io not initialised')
  return io
}
