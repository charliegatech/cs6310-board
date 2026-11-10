export type Status = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'
export type Priority = 'lowest' | 'low' | 'medium' | 'high' | 'highest'
export type TicketType = 'story' | 'task' | 'bug' | 'epic'

export interface TeamMember {
  id: string
  name: string
  initials: string
  color: string
}

export interface Ticket {
  id: string
  key: string
  title: string
  description: string
  status: Status
  priority: Priority
  type: TicketType
  assigneeId: string | null
  storyPoints: number | null
  labels: string[]
  createdAt: string
  updatedAt: string
}

export interface BoardState {
  tickets: Ticket[]
  nextNumber: number
  savedAt?: string
}

export const STATUSES: { id: Status; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'In Review' },
  { id: 'done', label: 'Done' },
]

export const PRIORITIES: Priority[] = [
  'highest',
  'high',
  'medium',
  'low',
  'lowest',
]

export const TICKET_TYPES: TicketType[] = ['story', 'task', 'bug', 'epic']
