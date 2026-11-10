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
    resetBoard,
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
        onReset={() => {
          if (confirm('Reset the board to the sample CS6310 demo data?')) {
            resetBoard()
          }
        }}
        total={tickets.length}
        done={doneCount}
      />

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
