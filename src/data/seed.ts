import type { BoardState, TeamMember } from '../types'

export const TEAM: TeamMember[] = [
  { id: 'm1', name: 'Charles Andrew Dao', initials: 'CD', color: '#0052CC' },
  { id: 'm2', name: 'Srikar Irrinki', initials: 'SI', color: '#00875A' },
  { id: 'm3', name: 'Thanemul Islam', initials: 'TI', color: '#6554C0' },
  { id: 'm4', name: 'Muhammed Fethi Muktar', initials: 'MM', color: '#FF5630' },
  { id: 'm5', name: 'James Micah Simmerman', initials: 'JS', color: '#FF8B00' },
]

export const PROJECT_KEY = 'CS6310'

const now = Date.now()
const daysAgo = (n: number) => new Date(now - n * 86400000).toISOString()

export const SEED_STATE: BoardState = {
  nextNumber: 9,
  tickets: [
    {
      id: 't1',
      key: 'CS6310-1',
      title: 'Define system architecture for ride-sharing simulator',
      description:
        'Draft component diagram, data flow, and module boundaries for the CS6310 team project.',
      status: 'done',
      priority: 'high',
      type: 'epic',
      assigneeId: 'm1',
      storyPoints: 5,
      labels: ['architecture', 'docs'],
      createdAt: daysAgo(14),
      updatedAt: daysAgo(10),
    },
    {
      id: 't2',
      key: 'CS6310-2',
      title: 'Implement vehicle fleet model',
      description:
        'Model vehicles with capacity, location, and status. Support add/remove and status transitions.',
      status: 'in_progress',
      priority: 'highest',
      type: 'story',
      assigneeId: 'm2',
      storyPoints: 8,
      labels: ['backend', 'domain'],
      createdAt: daysAgo(12),
      updatedAt: daysAgo(1),
    },
    {
      id: 't3',
      key: 'CS6310-3',
      title: 'Build request matching algorithm',
      description:
        'Match rider requests to available vehicles using distance and capacity constraints.',
      status: 'todo',
      priority: 'high',
      type: 'story',
      assigneeId: 'm3',
      storyPoints: 13,
      labels: ['algorithm', 'core'],
      createdAt: daysAgo(10),
      updatedAt: daysAgo(3),
    },
    {
      id: 't4',
      key: 'CS6310-4',
      title: 'Fix race condition in concurrent dispatch',
      description:
        'Two threads can assign the same vehicle. Add locking or atomic claim around dispatch.',
      status: 'todo',
      priority: 'highest',
      type: 'bug',
      assigneeId: 'm2',
      storyPoints: 5,
      labels: ['bug', 'concurrency'],
      createdAt: daysAgo(4),
      updatedAt: daysAgo(1),
    },
    {
      id: 't5',
      key: 'CS6310-5',
      title: 'Add simulation event log UI',
      description:
        'Show a live feed of pickup, dropoff, and rebalance events during a simulation run.',
      status: 'review',
      priority: 'medium',
      type: 'task',
      assigneeId: 'm4',
      storyPoints: 3,
      labels: ['frontend', 'ux'],
      createdAt: daysAgo(8),
      updatedAt: daysAgo(0),
    },
    {
      id: 't6',
      key: 'CS6310-6',
      title: 'Write unit tests for matching engine',
      description:
        'Cover empty fleet, oversubscribed demand, and multi-capacity vehicle cases.',
      status: 'backlog',
      priority: 'medium',
      type: 'task',
      assigneeId: 'm5',
      storyPoints: 5,
      labels: ['testing'],
      createdAt: daysAgo(6),
      updatedAt: daysAgo(6),
    },
    {
      id: 't7',
      key: 'CS6310-7',
      title: 'Prepare midterm demo script',
      description:
        'Outline walkthrough for TA/instructor: architecture, live sim, metrics, Q&A.',
      status: 'backlog',
      priority: 'low',
      type: 'task',
      assigneeId: 'm1',
      storyPoints: 2,
      labels: ['demo', 'docs'],
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
    },
    {
      id: 't8',
      key: 'CS6310-8',
      title: 'Export simulation metrics CSV',
      description:
        'Export wait time, trip distance, utilization, and completion rate after each run.',
      status: 'in_progress',
      priority: 'medium',
      type: 'story',
      assigneeId: 'm5',
      storyPoints: 3,
      labels: ['analytics'],
      createdAt: daysAgo(7),
      updatedAt: daysAgo(2),
    },
  ],
}
