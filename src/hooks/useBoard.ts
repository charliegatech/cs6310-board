import { useCallback, useEffect, useMemo, useState } from 'react'
import { SEED_STATE, PROJECT_KEY } from '../data/seed'
import type {
  BoardState,
  Priority,
  Status,
  Ticket,
  TicketType,
} from '../types'

const STORAGE_KEY = 'cs6310-board-v1'

function loadState(): BoardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(SEED_STATE)
    const parsed = JSON.parse(raw) as BoardState
    if (!parsed.tickets || typeof parsed.nextNumber !== 'number') {
      return structuredClone(SEED_STATE)
    }
    return parsed
  } catch {
    return structuredClone(SEED_STATE)
  }
}

export interface TicketDraft {
  title: string
  description: string
  status: Status
  priority: Priority
  type: TicketType
  assigneeId: string | null
  storyPoints: number | null
  labels: string[]
}

export function useBoard() {
  const [state, setState] = useState<BoardState>(() => loadState())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const createTicket = useCallback((draft: TicketDraft) => {
    setState((prev) => {
      const now = new Date().toISOString()
      const ticket: Ticket = {
        id: crypto.randomUUID(),
        key: `${PROJECT_KEY}-${prev.nextNumber}`,
        title: draft.title.trim(),
        description: draft.description.trim(),
        status: draft.status,
        priority: draft.priority,
        type: draft.type,
        assigneeId: draft.assigneeId,
        storyPoints: draft.storyPoints,
        labels: draft.labels,
        createdAt: now,
        updatedAt: now,
      }
      return {
        nextNumber: prev.nextNumber + 1,
        tickets: [ticket, ...prev.tickets],
      }
    })
  }, [])

  const updateTicket = useCallback((id: string, draft: TicketDraft) => {
    setState((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) =>
        t.id === id
          ? {
              ...t,
              title: draft.title.trim(),
              description: draft.description.trim(),
              status: draft.status,
              priority: draft.priority,
              type: draft.type,
              assigneeId: draft.assigneeId,
              storyPoints: draft.storyPoints,
              labels: draft.labels,
              updatedAt: new Date().toISOString(),
            }
          : t,
      ),
    }))
  }, [])

  const deleteTicket = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tickets: prev.tickets.filter((t) => t.id !== id),
    }))
  }, [])

  const moveTicket = useCallback((id: string, status: Status) => {
    setState((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) =>
        t.id === id
          ? { ...t, status, updatedAt: new Date().toISOString() }
          : t,
      ),
    }))
  }, [])

  const resetBoard = useCallback(() => {
    const next = structuredClone(SEED_STATE)
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const ticketsByStatus = useMemo(() => {
    const map: Record<Status, Ticket[]> = {
      backlog: [],
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    }
    for (const ticket of state.tickets) {
      map[ticket.status].push(ticket)
    }
    return map
  }, [state.tickets])

  return {
    tickets: state.tickets,
    ticketsByStatus,
    createTicket,
    updateTicket,
    deleteTicket,
    moveTicket,
    resetBoard,
  }
}
