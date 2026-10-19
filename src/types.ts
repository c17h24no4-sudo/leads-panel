export type Status = 'new' | 'work' | 'won' | 'lost'
export type Service = 'site' | 'bot' | 'promo' | 'rework'

export interface Lead {
  id: number
  name: string
  phone: string
  service: Service
  source: string
  amount: number // ориентировочная стоимость, ₽
  status: Status
  createdAt: string // ISO
  notes: string
}

export const STATUS_LABEL: Record<Status, string> = {
  new: 'Новая',
  work: 'В работе',
  won: 'Оплачена',
  lost: 'Отказ',
}

export const SERVICE_LABEL: Record<Service, string> = {
  site: 'Новый сайт',
  bot: 'Чат-бот',
  promo: 'Продвижение',
  rework: 'Доработка сайта',
}

export type SortKey = 'createdAt' | 'amount' | 'name'
export interface Filters {
  query: string
  status: Status | 'all'
  service: Service | 'all'
  sort: SortKey
  dir: 'asc' | 'desc'
}
