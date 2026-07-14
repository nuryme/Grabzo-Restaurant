import { createServer } from 'node:http'
import { createApp } from './app.js'
import { connectDb } from './config/db.js'
import { initSocket } from './socket/io.js'
import { env } from './config/env.js'

const app = createApp()
const httpServer = createServer(app)
initSocket(httpServer)

httpServer.listen(env.port, () => {
  console.log(`[server] http://localhost:${env.port}`)
})

// Connect to Mongo in the background so the server serves immediately.
// Local-first dev: keep serving even if Mongo isn't up yet.
connectDb().catch((err) => {
  console.warn('[db] connection failed — API routes needing the DB will error:', (err as Error).message)
})
