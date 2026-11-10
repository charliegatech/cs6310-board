import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { TEAM } from '../data/seed'
import type { TicketDraft } from '../hooks/useBoard'
import {
  PRIORITIES,
  STATUSES,
  TICKET_TYPES,
  type Ticket,
} from '../types'

interface TicketModalProps {
  ticket: Ticket | null
  open: boolean
  onClose: () => void
  onSave: (draft: TicketDraft) => void
  onDelete?: () => void
  defaultStatus?: Ticket['status']
}

const emptyDraft = (status: Ticket['status'] = 'todo'): TicketDraft => ({
  title: '',
  description: '',
  status,
  priority: 'medium',
  type: 'task',
  assigneeId: null,
  storyPoints: null,
  labels: [],
})

export function TicketModal({
  ticket,
  open,
  onClose,
  onSave,
  onDelete,
  defaultStatus = 'todo',
}: TicketModalProps) {
  const [draft, setDraft] = useState<TicketDraft>(emptyDraft(defaultStatus))
  const [labelInput, setLabelInput] = useState('')

  useEffect(() => {
    if (!open) return
    if (ticket) {
      setDraft({
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        type: ticket.type,
        assigneeId: ticket.assigneeId,
        storyPoints: ticket.storyPoints,
        labels: [...ticket.labels],
      })
    } else {
      setDraft(emptyDraft(defaultStatus))
    }
    setLabelInput('')
  }, [open, ticket, defaultStatus])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const addLabel = () => {
    const value = labelInput.trim().toLowerCase()
    if (!value || draft.labels.includes(value)) return
    setDraft((d) => ({ ...d, labels: [...d.labels, value] }))
    setLabelInput('')
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.title.trim()) return
    onSave(draft)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <p className="modal-eyebrow">
              {ticket ? ticket.key : 'New ticket'}
            </p>
            <h2 id="ticket-modal-title">
              {ticket ? 'Edit ticket' : 'Create ticket'}
            </h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <form className="modal-form" onSubmit={submit}>
          <label>
            Title
            <input
              autoFocus
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({ ...d, title: e.target.value }))
              }
              placeholder="What needs to get done?"
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={draft.description}
              onChange={(e) =>
                setDraft((d) => ({ ...d, description: e.target.value }))
              }
              placeholder="Acceptance criteria, notes, links…"
              rows={4}
            />
          </label>

          <div className="form-grid">
            <label>
              Type
              <select
                value={draft.type}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    type: e.target.value as TicketDraft['type'],
                  }))
                }
              >
                {TICKET_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select
                value={draft.status}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    status: e.target.value as TicketDraft['status'],
                  }))
                }
              >
                {STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Priority
              <select
                value={draft.priority}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    priority: e.target.value as TicketDraft['priority'],
                  }))
                }
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Assignee
              <select
                value={draft.assigneeId ?? ''}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    assigneeId: e.target.value || null,
                  }))
                }
              >
                <option value="">Unassigned</option>
                {TEAM.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Story points
              <input
                type="number"
                min={0}
                max={100}
                value={draft.storyPoints ?? ''}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    storyPoints:
                      e.target.value === '' ? null : Number(e.target.value),
                  }))
                }
                placeholder="—"
              />
            </label>
          </div>

          <label>
            Labels
            <div className="label-editor">
              <input
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addLabel()
                  }
                }}
                placeholder="Type a label and press Enter"
              />
              <button type="button" className="btn ghost" onClick={addLabel}>
                Add
              </button>
            </div>
            <div className="ticket-labels modal-labels">
              {draft.labels.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="label-chip removable"
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      labels: d.labels.filter((l) => l !== label),
                    }))
                  }
                >
                  {label} ×
                </button>
              ))}
            </div>
          </label>

          <footer className="modal-footer">
            {ticket && onDelete && (
              <button
                type="button"
                className="btn danger"
                onClick={() => {
                  if (confirm(`Delete ${ticket.key}?`)) {
                    onDelete()
                    onClose()
                  }
                }}
              >
                Delete
              </button>
            )}
            <div className="modal-footer-right">
              <button type="button" className="btn ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn primary">
                {ticket ? 'Save changes' : 'Create ticket'}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  )
}
