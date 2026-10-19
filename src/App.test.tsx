import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { SEED } from './data'

beforeEach(() => localStorage.clear())

const rows = () => screen.getAllByRole('row').slice(1)

describe('App', () => {
  it('показывает все заявки и сводку', () => {
    render(<App />)
    expect(rows()).toHaveLength(SEED.length)
    expect(screen.getByTestId('total')).toHaveTextContent(String(SEED.length))
  })

  it('поиск сужает таблицу, пустой результат показывает подсказку', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Поиск'), 'Соколова')
    expect(rows()).toHaveLength(1)
    await u.clear(screen.getByLabelText('Поиск'))
    await u.type(screen.getByLabelText('Поиск'), 'такого нет')
    expect(screen.getByText(/Ничего не найдено/)).toBeInTheDocument()
  })

  it('смена статуса обновляет сводку «Оплачено»', async () => {
    const u = userEvent.setup()
    render(<App />)
    const before = screen.getByTestId('won').textContent
    await u.selectOptions(screen.getByLabelText('Статус: Анна Соколова'), 'won')
    expect(screen.getByTestId('won').textContent).not.toBe(before)
  })

  it('фильтр по статусу через кнопки', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /^Отказ/ }))
    const r = rows()
    expect(r.length).toBe(SEED.filter((l) => l.status === 'lost').length)
    r.forEach((row) => expect(within(row).getByRole('combobox')).toHaveValue('lost'))
  })

  it('заметка в карточке сохраняется между перезагрузками', async () => {
    const u = userEvent.setup()
    const { unmount } = render(<App />)
    await u.click(screen.getByRole('button', { name: 'Анна Соколова' }))
    const note = screen.getByLabelText('Заметка менеджера')
    await u.clear(note)
    await u.type(note, 'позвонить завтра')
    unmount()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Анна Соколова' }))
    expect(screen.getByLabelText('Заметка менеджера')).toHaveValue('позвонить завтра')
  })
})
