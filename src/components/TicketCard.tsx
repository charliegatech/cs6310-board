import type { ReactNode } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Bug,
  ChevronsDown,
  ChevronsUp,
  Equal,
  Bookmark,
  CheckSquare,
  Zap,
} from 'lucide-react'
import { TEAM } from '../data/seed'
import type { Priority, Ticket, TicketType } from '../types'
import { Avatar } from './Avatar'

interface TicketCardProps {
  ticket: Ticket
  onOpen: (ticket: Ticket) => void
  onDragStart: (ticketId: string) => void
}

const priorityIcon: Record<Priority, ReactNode> = {
  highest: <ChevronsUp size={14} className="prio highest" />,
  high: <ArrowUp size={14} className="prio high" />,
  medium: <Equal size={14} className="prio medium" />,
  low: <ArrowDown size={14} className="prio low" />,
  lowest: <ChevronsDown size={14} className="prio lowest" />,
}

const typeIcon: Record<TicketType, ReactNode> = {
  story: <Bookmark size={14} className="type-icon story" />,
  task: <CheckSquare size={14} className="type-icon task" />,
  bug: <Bug size={14} className="type-icon bug" />,
  epic: <Zap size={14} className="type-icon epic" />,
}

export function TicketCard({ ticket, onOpen, onDragStart }: TicketCardProps) {
  const assignee = TEAM.find((m) => m.id === ticket.assigneeId)

  return (
    <article
      className="ticket-card"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', ticket.id)
        e.dataTransfer.effectAllowed = 'move'
        onDragStart(ticket.id)
      }}
      onClick={() => onOpen(ticket)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(ticket)
        }
      }}
    >
      <p className="ticket-title">{ticket.title}</p>
      {ticket.labels.length > 0 && (
        <div className="ticket-labels">
          {ticket.labels.map((label) => (
            <span key={label} className="label-chip">
              {label}
            </span>
          ))}
        </div>
      )}
      <div className="ticket-meta">
        <div className="ticket-meta-left">
          {typeIcon[ticket.type]}
          <span className="ticket-key">{ticket.key}</span>
          {priorityIcon[ticket.priority]}
        </div>
        <div className="ticket-meta-right">
          {ticket.storyPoints != null && (
            <span className="points">{ticket.storyPoints}</span>
          )}
          <Avatar member={assignee} />
        </div>
      </div>
    </article>
  )
}
