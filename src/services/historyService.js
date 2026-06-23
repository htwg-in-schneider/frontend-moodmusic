import { request } from './api.js'

export function recordListen(songId, mood = '') {
  return request('/api/history/listen', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ songId, mood })
  })
}

export function getDailyHistory(days = 14) {
  return request(`/api/history/daily?days=${days}`)
}

export function getHistoryDay(date) {
  return request(`/api/history/day?date=${encodeURIComponent(date)}`)
}
