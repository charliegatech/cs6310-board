import type { TeamMember } from '../types'

interface AvatarProps {
  member: TeamMember | undefined | null
  size?: 'sm' | 'md'
}

export function Avatar({ member, size = 'sm' }: AvatarProps) {
  if (!member) {
    return (
      <span
        className={`avatar avatar-empty avatar-${size}`}
        title="Unassigned"
        aria-label="Unassigned"
      >
        ?
      </span>
    )
  }

  return (
    <span
      className={`avatar avatar-${size}`}
      style={{ background: member.color }}
      title={member.name}
      aria-label={member.name}
    >
      {member.initials}
    </span>
  )
}
