import type { Status, Ticket } from '../types'
import { TicketCard } from './TicketCard'

interface ColumnProps {
  status: Status
  label: string
  tickets: Ticket[]
  onOpen: (ticket: Ticket) => void
  onDropTicket: (ticketId: string, status: Status) => void
  onDragStart: (ticketId: string) => void
}

export function Column({
  status,
  label,
  tickets,
  onOpen,
  onDropTicket,
  onDragStart,
}: ColumnProps) {
  return (
    <section
      className="column"
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
      }}
      onDrop={(e) => {
        e.preventDefault()
        const id = e.dataTransfer.getData('text/plain')
        if (id) onDropTicket(id, status)
      }}
    >
      <header className="column-header">
        <h2>{label}</h2>
        <span className="column-count">{tickets.length}</span>
      </header>
      <div className="column-body">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onOpen={onOpen}
            onDragStart={onDragStart}
          />
        ))}
        {tickets.length === 0 && (
          <div className="column-empty">Drop tickets here</div>
        )}
      </div>
    </section>
  )
}
