import { useMemo, useState } from 'react'
import { Column } from './components/Column'
import { Header } from './components/Header'
import { TicketModal } from './components/TicketModal'
import { useBoard } from './hooks/useBoard'
import { STATUSES, type Ticket } from './types'
import './App.css'

export default function App() {
  const {
    tickets,
    ticketsByStatus,
    createTicket,
    updateTicket,
    deleteTicket,
    moveTicket,
    refresh,
    sync,
    syncError,
    savedAt,
    ready,
  } = useBoard()

  const [query, setQuery] = useState('')
  const [assigneeFilter, setAssigneeFilter] = useState<string | 'all'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)

  const filteredByStatus = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = (ticket: Ticket) => {
      if (assigneeFilter === 'unassigned' && ticket.assigneeId) return false
      if (
        assigneeFilter !== 'all' &&
        assigneeFilter !== 'unassigned' &&
        ticket.assigneeId !== assigneeFilter
      ) {
        return false
      }
      if (!q) return true
      return (
        ticket.title.toLowerCase().includes(q) ||
        ticket.key.toLowerCase().includes(q) ||
        ticket.description.toLowerCase().includes(q) ||
        ticket.labels.some((l) => l.includes(q))
      )
    }

    return Object.fromEntries(
      STATUSES.map((s) => [s.id, ticketsByStatus[s.id].filter(matches)]),
    ) as typeof ticketsByStatus
  }, [ticketsByStatus, query, assigneeFilter])

  const doneCount = tickets.filter((t) => t.status === 'done').length

  return (
    <div className="app">
      <Header
        query={query}
        onQueryChange={setQuery}
        assigneeFilter={assigneeFilter}
        onAssigneeFilter={setAssigneeFilter}
        onCreate={() => {
          setActiveTicket(null)
          setModalOpen(true)
        }}
        onRefresh={() => {
          void refresh()
        }}
        sync={sync}
        syncError={syncError}
        savedAt={savedAt}
        ready={ready}
        total={tickets.length}
        done={doneCount}
      />

      {sync === 'error' && tickets.length === 0 ? (
        <main className="board-message">
          <h2>Shared board unavailable</h2>
          <p>{syncError}</p>
        </main>
      ) : !ready ? (
        <main className="board-message">
          <h2>Loading shared board…</h2>
          <p>Pulling the latest tickets from board.json.</p>
        </main>
      ) : (
      <main className="board">
        {STATUSES.map((status) => (
          <Column
            key={status.id}
            status={status.id}
            label={status.label}
            tickets={filteredByStatus[status.id]}
            onOpen={(ticket) => {
              setActiveTicket(ticket)
              setModalOpen(true)
            }}
            onDropTicket={moveTicket}
            onDragStart={() => undefined}
          />
        ))}
      </main>
      )}

      <TicketModal
        open={modalOpen}
        ticket={activeTicket}
        onClose={() => {
          setModalOpen(false)
          setActiveTicket(null)
        }}
        onSave={(draft) => {
          if (activeTicket) updateTicket(activeTicket.id, draft)
          else createTicket(draft)
        }}
        onDelete={
          activeTicket
            ? () => deleteTicket(activeTicket.id)
            : undefined
        }
      />
    </div>
  )
}
