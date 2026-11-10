import * as fs from 'node:fs'
import * as path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function boardApiPlugin(): Plugin {
  const file = path.resolve('data/board.json')

  return {
    name: 'board-api',
    configureServer(server) {
      server.middlewares.use('/board.json', (req, res) => {
        const send = (status: number, body: unknown) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store')
          res.end(JSON.stringify(body))
        }

        if (req.method === 'GET') {
          if (!fs.existsSync(file)) {
            send(404, { error: 'empty' })
            return
          }
          try {
            send(200, JSON.parse(fs.readFileSync(file, 'utf8')))
          } catch {
            send(500, { error: 'invalid' })
          }
          return
        }

        if (req.method === 'PUT') {
          const chunks: Buffer[] = []
          req.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
          req.on('end', () => {
            try {
              const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8')) as {
                tickets?: unknown
                nextNumber?: unknown
              }
              if (!Array.isArray(parsed.tickets) || typeof parsed.nextNumber !== 'number') {
                send(400, { error: 'invalid' })
                return
              }
              const saved = {
                tickets: parsed.tickets,
                nextNumber: parsed.nextNumber,
                savedAt: new Date().toISOString(),
              }
              fs.mkdirSync(path.dirname(file), { recursive: true })
              fs.writeFileSync(file, JSON.stringify(saved, null, 2))
              send(200, saved)
            } catch {
              send(400, { error: 'invalid' })
            }
          })
          return
        }

        send(405, { error: 'method' })
      })
    },
  }
}

export default defineConfig({
  plugins: [boardApiPlugin(), react()],
})
