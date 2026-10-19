import { describe, expect, it } from 'vitest'
import { SEED } from './data'
import { computeStats, filterLeads, toCsv } from './logic'
import type { Filters } from './types'

const base: Filters = { query: '', status: 'all', service: 'all', sort: 'createdAt', dir: 'desc' }

describe('filterLeads', () => {
  it('ищет по имени без учёта регистра', () => {
    const r = filterLeads(SEED, { ...base, query: 'соколова' })
    expect(r.map((l) => l.id)).toEqual([1])
  })
  it('фильтрует по статусу и услуге вместе', () => {
    const r = filterLeads(SEED, { ...base, status: 'won', service: 'bot' })
    expect(r.every((l) => l.status === 'won' && l.service === 'bot')).toBe(true)
    expect(r.length).toBe(2)
  })
  it('сортирует по сумме по возрастанию', () => {
    const r = filterLeads(SEED, { ...base, sort: 'amount', dir: 'asc' })
    expect(r[0].amount).toBe(Math.min(...SEED.map((l) => l.amount)))
  })
  it('не мутирует исходный массив', () => {
    const copy = [...SEED]
    filterLeads(SEED, { ...base, sort: 'name', dir: 'asc' })
    expect(SEED).toEqual(copy)
  })
})

describe('computeStats', () => {
  it('считает суммы и конверсию среди закрытых', () => {
    const s = computeStats(SEED)
    const won = SEED.filter((l) => l.status === 'won')
    const lost = SEED.filter((l) => l.status === 'lost')
    expect(s.wonAmount).toBe(won.reduce((a, l) => a + l.amount, 0))
    expect(s.conversion).toBe(Math.round((won.length / (won.length + lost.length)) * 100))
    expect(s.total).toBe(SEED.length)
  })
  it('конверсия 0, если закрытых нет', () => {
    expect(computeStats(SEED.filter((l) => l.status === 'new')).conversion).toBe(0)
  })
})

describe('toCsv', () => {
  it('экранирует кавычки и разделители, начинается с BOM', () => {
    const csv = toCsv([{ ...SEED[0], notes: 'Сказал "позже"; перезвонить' }])
    expect(csv.startsWith('﻿')).toBe(true)
    expect(csv).toContain('"Сказал ""позже""; перезвонить"')
    expect(csv.split('\n').length).toBe(2)
  })
})
