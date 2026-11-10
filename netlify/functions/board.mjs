import { getStore } from '@netlify/blobs'

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers })
}

function isBoard(value) {
  return (
    value &&
    typeof value === 'object' &&
    Array.isArray(value.tickets) &&
    typeof value.nextNumber === 'number'
  )
}

export default async (req) => {
  const store = getStore('cs6310-board')

  if (req.method === 'GET') {
    const data = await store.get('board.json', { type: 'json' })
    if (!isBoard(data)) return json({ error: 'empty' }, 404)
    return json(data)
  }

  if (req.method === 'PUT') {
    let body
    try {
      body = await req.json()
    } catch {
      return json({ error: 'invalid' }, 400)
    }
    if (!isBoard(body) || body.tickets.length > 1000) {
      return json({ error: 'invalid' }, 400)
    }

    const saved = {
      tickets: body.tickets,
      nextNumber: body.nextNumber,
      savedAt: new Date().toISOString(),
    }
    await store.setJSON('board.json', saved)
    return json(saved)
  }

  return json({ error: 'method' }, 405)
}
