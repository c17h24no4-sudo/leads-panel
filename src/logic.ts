import type { Filters, Lead, Status } from './types'
import { SERVICE_LABEL, STATUS_LABEL } from './types'

export function filterLeads(leads: Lead[], f: Filters): Lead[] {
  const q = f.query.trim().toLowerCase()
  const out = leads.filter((l) => {
    if (f.status !== 'all' && l.status !== f.status) return false
    if (f.service !== 'all' && l.service !== f.service) return false
    if (!q) return true
    return [l.name, l.phone, l.source, l.notes, SERVICE_LABEL[l.service]].some((s) => s.toLowerCase().includes(q))
  })
  const sign = f.dir === 'asc' ? 1 : -1
  return out.sort((a, b) => {
    const x = a[f.sort]
    const y = b[f.sort]
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * sign
    return String(x).localeCompare(String(y), 'ru') * sign
  })
}

export interface Stats {
  total: number
  byStatus: Record<Status, number>
  wonAmount: number
  pipelineAmount: number
  conversion: number // доля оплаченных среди закрытых (оплачена + отказ), %
}

export function computeStats(leads: Lead[]): Stats {
  const byStatus: Record<Status, number> = { new: 0, work: 0, won: 0, lost: 0 }
  let wonAmount = 0
  let pipelineAmount = 0
  for (const l of leads) {
    byStatus[l.status]++
    if (l.status === 'won') wonAmount += l.amount
    if (l.status === 'new' || l.status === 'work') pipelineAmount += l.amount
  }
  const closed = byStatus.won + byStatus.lost
  return { total: leads.length, byStatus, wonAmount, pipelineAmount, conversion: closed ? Math.round((byStatus.won / closed) * 100) : 0 }
}

const esc = (v: string | number) => {
  const s = String(v)
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function toCsv(leads: Lead[]): string {
  const head = ['id', 'Дата', 'Имя', 'Телефон', 'Услуга', 'Источник', 'Сумма', 'Статус', 'Заметка']
  const rows = leads.map((l) =>
    [l.id, l.createdAt.slice(0, 10), l.name, l.phone, SERVICE_LABEL[l.service], l.source, l.amount, STATUS_LABEL[l.status], l.notes].map(esc).join(';'),
  )
  return '﻿' + [head.join(';'), ...rows].join('\n')
}

export const rub = (n: number) => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽'
