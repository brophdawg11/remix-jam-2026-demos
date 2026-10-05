import * as http from 'node:http'
import { cop } from 'remix/middleware/cop'
import { logger } from 'remix/middleware/logger'
import { createRequestListener } from 'remix/node-fetch-server'

import { assets } from './app/assets.ts'
import { openGarageDatabase } from './app/data/setup.ts'
import { renderDocument } from './app/middleware/document.tsx'
import { createGarageRouter } from './app/router.ts'

const database = await openGarageDatabase()
const router = createGarageRouter(database.store, {
  render: renderDocument(),
  middleware: [...(process.env.NODE_ENV === 'development' ? [logger()] : []), cop()],
})
router.get(
  '/assets/*path',
  async ({ request }) =>
    (await assets.fetch(request)) ?? new Response('Not found', { status: 404 }),
)

const server = http.createServer(
  createRequestListener(async (request) => {
    try {
      return await router.fetch(request)
    } catch (error) {
      if (!request.signal.aborted) console.error(error)
      return new Response('Something went wrong in the garage. Please try again.', { status: 500 })
    }
  }),
)

const port = Number(process.env.PORT) || 44100
server.listen(port, '127.0.0.1', () => {
  console.log(`Remix Garage (top frame): http://localhost:${port}`)
})

let shuttingDown = false
function shutdown() {
  if (shuttingDown) return
  shuttingDown = true
  server.close(async () => {
    await database.close()
    process.exit(0)
  })
  server.closeAllConnections()
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
