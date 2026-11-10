import { Plus, RotateCcw, Search } from 'lucide-react'
import { TEAM } from '../data/seed'
import { Avatar } from './Avatar'

interface HeaderProps {
  query: string
  onQueryChange: (value: string) => void
  assigneeFilter: string | 'all'
  onAssigneeFilter: (value: string | 'all') => void
  onCreate: () => void
  onReset: () => void
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

        <button type="button" className="btn ghost" onClick={onReset}>
          <RotateCcw size={16} />
          Reset demo
        </button>
        <button type="button" className="btn primary" onClick={onCreate}>
          <Plus size={16} />
          Create
        </button>
      </div>
    </header>
  )
}
