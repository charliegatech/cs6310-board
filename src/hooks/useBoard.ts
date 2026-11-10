import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PROJECT_KEY } from '../data/seed'
import { fetchBoard, saveBoard } from '../lib/boardClient'
import type {
  BoardState,
  Priority,
  Status,
  Ticket,
  TicketType,
} from '../types'

const EMPTY: BoardState = { tickets: [], nextNumber: 1 }

export type SyncState = 'loading' | 'refreshing' | 'saving' | 'live' | 'error'

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
  const [state, setState] = useState<BoardState>(EMPTY)
  const [sync, setSync] = useState<SyncState>('loading')
  const [syncError, setSyncError] = useState<string | null>(null)
  const stateRef = useRef(state)
  const dirtyRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const queueRef = useRef(Promise.resolve())
  const readyRef = useRef(false)

  const apply = useCallback((next: BoardState) => {
    stateRef.current = next
    readyRef.current = true
    setState(next)
  }, [])

  const runExclusive = useCallback((task: () => Promise<void>) => {
    const next = queueRef.current.then(task, task)
    queueRef.current = next
    return next
  }, [])

  const pull = useCallback(
    () =>
      runExclusive(async () => {
        if (timerRef.current) {
          window.clearTimeout(timerRef.current)
          timerRef.current = null
        }

        setSync(readyRef.current ? 'refreshing' : 'loading')
        try {
          const remote = await fetchBoard()
          apply(remote ?? { tickets: [], nextNumber: 1 })
          setSync('live')
          setSyncError(null)
        } catch (error) {
          setSync('error')
          setSyncError(
            error instanceof Error ? error.message : 'Could not reach the shared board.',
          )
        }
      }),
    [apply, runExclusive],
  )

  const scheduleSave = useCallback(
    (next: BoardState) => {
      dirtyRef.current = true
      stateRef.current = next
      setState(next)
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null
        dirtyRef.current = false
        const snapshot = stateRef.current
        void runExclusive(async () => {
          setSync('saving')
          try {
            const saved = await saveBoard(snapshot)
            if (!dirtyRef.current) apply(saved)
            setSync('live')
            setSyncError(null)
          } catch (error) {
            dirtyRef.current = true
            setSync('error')
            setSyncError(
              error instanceof Error ? error.message : 'Could not save the shared board.',
            )
          }
        })
      }, 200)
    },
    [apply, runExclusive],
  )

  useEffect(() => {
    localStorage.removeItem('cs6310-board-v1')
    void pull()
    const onFocus = () => {
      if (document.visibilityState === 'hidden') return
      if (dirtyRef.current) return
      void pull()
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [pull])

  const createTicket = useCallback(
    (draft: TicketDraft) => {
      const prev = stateRef.current
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
      scheduleSave({
        nextNumber: prev.nextNumber + 1,
        tickets: [ticket, ...prev.tickets],
        savedAt: prev.savedAt,
      })
    },
    [scheduleSave],
  )

  const updateTicket = useCallback(
    (id: string, draft: TicketDraft) => {
      const prev = stateRef.current
      scheduleSave({
        ...prev,
        tickets: prev.tickets.map((ticket) =>
          ticket.id === id
            ? {
                ...ticket,
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
            : ticket,
        ),
      })
    },
    [scheduleSave],
  )

  const deleteTicket = useCallback(
    (id: string) => {
      const prev = stateRef.current
      scheduleSave({
        ...prev,
        tickets: prev.tickets.filter((ticket) => ticket.id !== id),
      })
    },
    [scheduleSave],
  )

  const moveTicket = useCallback(
    (id: string, status: Status) => {
      const prev = stateRef.current
      scheduleSave({
        ...prev,
        tickets: prev.tickets.map((ticket) =>
          ticket.id === id
            ? { ...ticket, status, updatedAt: new Date().toISOString() }
            : ticket,
        ),
      })
    },
    [scheduleSave],
  )

  const refresh = useCallback(() => pull(), [pull])

  const ticketsByStatus = useMemo(() => {
    const map: Record<Status, Ticket[]> = {
      backlog: [],
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    }
    for (const ticket of state.tickets) map[ticket.status].push(ticket)
    return map
  }, [state.tickets])

  return {
    tickets: state.tickets,
    ticketsByStatus,
    savedAt: state.savedAt,
    sync,
    syncError,
    ready: sync !== 'loading' && !(sync === 'error' && state.tickets.length === 0),
    createTicket,
    updateTicket,
    deleteTicket,
    moveTicket,
    refresh,
  }
}
