import type { BoardState } from '../types'

export const BOARD_URL = '/board.json'

function isBoard(value: unknown): value is BoardState {
  if (!value || typeof value !== 'object') return false
  const board = value as BoardState
  return Array.isArray(board.tickets) && typeof board.nextNumber === 'number'
}

export async function fetchBoard(): Promise<BoardState | null> {
  const res = await fetch(BOARD_URL, { cache: 'no-store' })
  const text = await res.text()
  if (res.status === 404) return null

  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(
      'Shared board is not live yet. Connect the GitHub repo on Netlify so /board.json can load.',
    )
  }

  if (
    data &&
    typeof data === 'object' &&
    'error' in data &&
    (data as { error?: string }).error === 'empty'
  ) {
    return null
  }

  if (!res.ok || !isBoard(data)) {
    throw new Error('Could not read the shared board.')
  }

  return data
}

export async function saveBoard(state: BoardState): Promise<BoardState> {
  const res = await fetch(BOARD_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tickets: state.tickets,
      nextNumber: state.nextNumber,
    }),
  })
  const text = await res.text()
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('Could not save the shared board.')
  }
  if (!res.ok || !isBoard(data)) {
    throw new Error('Could not save the shared board.')
  }
  return data
}
