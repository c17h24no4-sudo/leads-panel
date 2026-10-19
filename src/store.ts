import { useEffect, useReducer } from 'react'
import { SEED } from './data'
import type { Lead, Status } from './types'

type Action = { type: 'status'; id: number; status: Status } | { type: 'notes'; id: number; notes: string } | { type: 'reset' }

export function reducer(state: Lead[], a: Action): Lead[] {
  switch (a.type) {
    case 'status':
      return state.map((l) => (l.id === a.id ? { ...l, status: a.status } : l))
    case 'notes':
      return state.map((l) => (l.id === a.id ? { ...l, notes: a.notes } : l))
    case 'reset':
      return SEED
  }
}

const KEY = 'leads-panel:v1'

function load(): Lead[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Lead[]
  } catch {
    /* хранилище недоступно — работаем с демо-данными */
  }
  return SEED
}

export function useLeads() {
  const [leads, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(leads))
    } catch {
      /* ignore */
    }
  }, [leads])
  return { leads, dispatch }
}
