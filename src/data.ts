import type { Lead } from './types'

// Демонстрационные данные: имена и номера вымышленные.
export const SEED: Lead[] = [
  { id: 1, name: 'Анна Соколова', phone: '+7 900 111-22-01', service: 'site', source: 'Telegram-бот', amount: 90000, status: 'work', createdAt: '2026-10-12T09:15:00', notes: 'Интернет-магазин косметики, нужна оплата и доставка СДЭК' },
  { id: 2, name: 'Игорь Петров', phone: '+7 900 111-22-02', service: 'bot', source: 'Сайт', amount: 45000, status: 'won', createdAt: '2026-10-08T14:02:00', notes: 'Бот записи для барбершопа' },
  { id: 3, name: 'Мария Кузнецова', phone: '+7 900 111-22-03', service: 'promo', source: 'Telegram-бот', amount: 20000, status: 'new', createdAt: '2026-10-19T18:40:00', notes: 'Яндекс Директ, Казань' },
  { id: 4, name: 'Олег Смирнов', phone: '+7 900 111-22-04', service: 'rework', source: 'Рекомендация', amount: 31000, status: 'work', createdAt: '2026-10-15T11:20:00', notes: 'Tilda, добавить калькулятор' },
  { id: 5, name: 'Елена Васильева', phone: '+7 900 111-22-05', service: 'site', source: 'Сайт', amount: 25000, status: 'lost', createdAt: '2026-10-03T10:00:00', notes: 'Выбрала шаблон дешевле' },
  { id: 6, name: 'Дмитрий Новиков', phone: '+7 900 111-22-06', service: 'bot', source: 'Telegram-бот', amount: 130000, status: 'new', createdAt: '2026-10-20T08:05:00', notes: 'Бот + мини-приложение для доставки обедов' },
  { id: 7, name: 'Светлана Морозова', phone: '+7 900 111-22-07', service: 'site', source: 'Сайт', amount: 60000, status: 'won', createdAt: '2026-09-28T13:30:00', notes: 'Сайт юриста, многостраничный' },
  { id: 8, name: 'Артём Волков', phone: '+7 900 111-22-08', service: 'promo', source: 'Рекомендация', amount: 35000, status: 'work', createdAt: '2026-10-16T16:45:00', notes: 'Директ + карты, ведение 15 000 в месяц' },
  { id: 9, name: 'Наталья Лебедева', phone: '+7 900 111-22-09', service: 'rework', source: 'Сайт', amount: 15000, status: 'new', createdAt: '2026-10-18T12:10:00', notes: 'WordPress, не работает форма' },
  { id: 10, name: 'Павел Орлов', phone: '+7 900 111-22-10', service: 'bot', source: 'Telegram-бот', amount: 60000, status: 'lost', createdAt: '2026-10-01T09:50:00', notes: 'Решили отложить на следующий квартал' },
  { id: 11, name: 'Ольга Зайцева', phone: '+7 900 111-22-11', service: 'site', source: 'Сайт', amount: 110000, status: 'work', createdAt: '2026-10-14T15:00:00', notes: 'Товары и услуги, оплата, личный кабинет' },
  { id: 12, name: 'Сергей Попов', phone: '+7 900 111-22-12', service: 'bot', source: 'Рекомендация', amount: 45000, status: 'won', createdAt: '2026-10-05T17:25:00', notes: 'Бот заявок для автосервиса' },
]
