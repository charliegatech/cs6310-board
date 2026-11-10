import { Plus, RefreshCw, RotateCcw, Search } from 'lucide-react'
import { TEAM } from '../data/seed'
import type { SyncState } from '../hooks/useBoard'
import { Avatar } from './Avatar'

interface HeaderProps {
  query: string
  onQueryChange: (value: string) => void
  assigneeFilter: string | 'all'
  onAssigneeFilter: (value: string | 'all') => void
  onCreate: () => void
  onReset: () => void
  onRefresh: () => void
  sync: SyncState
  syncError: string | null
  savedAt?: string
  ready: boolean
  total: number
  done: number
}

export function Header({
  query,
  onQueryChange,
  assigneeFilter,
  onAssigneeFilter,
  onCreate,
  onReset,
  onRefresh,
  sync,
  syncError,
  savedAt,
  ready,
  total,
  done,
}: HeaderProps) {
  const progress = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark">CS</div>
        <div>
          <p className="brand-kicker">Georgia Tech · Software Engineering</p>
          <h1>CS6310 Team Board</h1>
        </div>
      </div>

      <div className="header-stats">
        <div className="stat">
          <span className="stat-label">Progress</span>
          <strong>
            {done}/{total} done · {progress}%
          </strong>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="sync-pill" aria-live="polite" title={syncError ?? undefined}>
            <span className={`sync-dot ${sync}`} />
            {syncText(sync, savedAt, syncError)}
          </p>
        </div>
      </div>

      <div className="header-actions">
        <div className="search">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search tickets…"
            aria-label="Search tickets"
          />
        </div>

        <select
          className="filter-select"
          value={assigneeFilter}
          onChange={(e) =>
            onAssigneeFilter(e.target.value as string | 'all')
          }
          aria-label="Filter by assignee"
        >
          <option value="all">Everyone</option>
          <option value="unassigned">Unassigned</option>
          {TEAM.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <div className="team-stack" aria-label="Team members">
          {TEAM.map((m) => (
            <Avatar key={m.id} member={m} size="md" />
          ))}
        </div>

        <button type="button" className="btn ghost" onClick={onRefresh}>
          <RefreshCw
            size={16}
            className={sync === 'loading' || sync === 'refreshing' ? 'spin' : undefined}
          />
          Refresh
        </button>
        <button type="button" className="btn ghost" onClick={onReset} disabled={!ready}>
          <RotateCcw size={16} />
          Reset demo
        </button>
        <button type="button" className="btn primary" onClick={onCreate} disabled={!ready}>
          <Plus size={16} />
          Create
        </button>
      </div>
    </header>
  )
}

function syncText(sync: SyncState, savedAt: string | undefined, error: string | null) {
  if (sync === 'loading') return 'Loading shared board…'
  if (sync === 'refreshing') return 'Refreshing…'
  if (sync === 'saving') return 'Saving…'
  if (sync === 'error') return error ?? 'Sync failed'
  if (!savedAt) return 'Live · shared board'
  const time = new Date(savedAt)
  if (Number.isNaN(time.getTime())) return 'Live · shared board'
  return `Live · ${time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
}
