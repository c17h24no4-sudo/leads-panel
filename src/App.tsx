import { useMemo, useState } from 'react'
import './App.css'
import { computeStats, filterLeads, rub, toCsv } from './logic'
import { useLeads } from './store'
import type { Filters, Lead, SortKey, Status } from './types'
import { SERVICE_LABEL, STATUS_LABEL } from './types'

const STATUSES = Object.keys(STATUS_LABEL) as Status[]

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

export default function App() {
  const { leads, dispatch } = useLeads()
  const [f, setF] = useState<Filters>({ query: '', status: 'all', service: 'all', sort: 'createdAt', dir: 'desc' })
  const [openId, setOpenId] = useState<number | null>(null)

  const shown = useMemo(() => filterLeads(leads, f), [leads, f])
  const stats = useMemo(() => computeStats(leads), [leads])
  const open: Lead | undefined = leads.find((l) => l.id === openId)

  const sortBy = (key: SortKey) => setF((p) => ({ ...p, sort: key, dir: p.sort === key && p.dir === 'desc' ? 'asc' : 'desc' }))
  const arrow = (key: SortKey) => (f.sort === key ? (f.dir === 'asc' ? ' ▲' : ' ▼') : '')

  return (
    <div className="wrap">
      <header>
        <h1>Заявки</h1>
        <div className="actions">
          <button onClick={() => download('leads.csv', toCsv(shown))}>Скачать CSV ({shown.length})</button>
          <button className="ghost" onClick={() => dispatch({ type: 'reset' })}>Сбросить демо</button>
        </div>
      </header>

      <section className="cards" aria-label="Сводка">
        <div className="card"><span>Всего заявок</span><b data-testid="total">{stats.total}</b></div>
        <div className="card"><span>В воронке</span><b data-testid="pipeline">{rub(stats.pipelineAmount)}</b></div>
        <div className="card"><span>Оплачено</span><b data-testid="won">{rub(stats.wonAmount)}</b></div>
        <div className="card"><span>Конверсия</span><b data-testid="conv">{stats.conversion}%</b></div>
      </section>

      <section className="filters" aria-label="Фильтры">
        <input type="search" placeholder="Поиск по имени, телефону, заметке…" aria-label="Поиск" value={f.query} onChange={(e) => setF({ ...f, query: e.target.value })} />
        <select aria-label="Услуга" value={f.service} onChange={(e) => setF({ ...f, service: e.target.value as Filters['service'] })}>
          <option value="all">Все услуги</option>
          {Object.entries(SERVICE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <div className="chips" role="group" aria-label="Статус">
          <button aria-pressed={f.status === 'all'} onClick={() => setF({ ...f, status: 'all' })}>Все</button>
          {STATUSES.map((s) => (
            <button key={s} aria-pressed={f.status === s} onClick={() => setF({ ...f, status: s })}>
              {STATUS_LABEL[s]} · {stats.byStatus[s]}
            </button>
          ))}
        </div>
      </section>

      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th><button className="th" onClick={() => sortBy('createdAt')}>Дата{arrow('createdAt')}</button></th>
              <th><button className="th" onClick={() => sortBy('name')}>Клиент{arrow('name')}</button></th>
              <th>Услуга</th>
              <th><button className="th" onClick={() => sortBy('amount')}>Сумма{arrow('amount')}</button></th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((l) => (
              <tr key={l.id} className={l.id === openId ? 'sel' : ''}>
                <td>{l.createdAt.slice(0, 10)}</td>
                <td><button className="link" onClick={() => setOpenId(l.id)}>{l.name}</button><small>{l.phone}</small></td>
                <td>{SERVICE_LABEL[l.service]}</td>
                <td>{rub(l.amount)}</td>
                <td>
                  <select className={`st st-${l.status}`} aria-label={`Статус: ${l.name}`} value={l.status} onChange={(e) => dispatch({ type: 'status', id: l.id, status: e.target.value as Status })}>
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={5} className="empty">Ничего не найдено. Измените фильтры.</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <aside className="drawer" aria-label="Карточка заявки">
          <button className="close" onClick={() => setOpenId(null)} aria-label="Закрыть">×</button>
          <h2>{open.name}</h2>
          <p>{open.phone} · {SERVICE_LABEL[open.service]} · {open.source}</p>
          <p>Ориентировочная сумма: <b>{rub(open.amount)}</b></p>
          <label>Заметка менеджера
            <textarea value={open.notes} onChange={(e) => dispatch({ type: 'notes', id: open.id, notes: e.target.value })} />
          </label>
        </aside>
      )}
    </div>
  )
}
