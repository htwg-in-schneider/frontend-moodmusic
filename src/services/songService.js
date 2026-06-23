import { appStore } from '../store.js'
import { request, API_BASE, authHeaders } from './api.js'

function localFilter(suche = '', mood = '') {
  const q = String(suche || '').toLowerCase()
  return appStore.songs.filter(song => {
    const matchesSearch = !q || `${song.titel} ${song.kuenstler}`.toLowerCase().includes(q)
    const matchesMood = !mood || song.emotionsKategorie === mood
    return matchesSearch && matchesMood
  })
}

function buildSongFormData(song) {
  const formData = new FormData()
  formData.append('titel', song.titel || '')
  formData.append('kuenstler', song.kuenstler || '')
  formData.append('stimmungsKategorie', song.emotionsKategorie || song.stimmungsKategorie || '')
  if (song.file) formData.append('file', song.file)
  return formData
}

async function fetchMultipart(path, method, song) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: buildSongFormData(song)
  })

  if (!response.ok) {
    let message = 'Song konnte nicht gespeichert werden.'
    try { message = (await response.json()).message || message } catch {}
    throw new Error(message)
  }
  return response.json()
}

export async function getSongs(suche = '', mood = '') {
  const params = new URLSearchParams()
  if (suche) params.append('suche', suche)
  if (mood) params.append('mood', mood)

  try {
    const data = await request(`/api/songs?${params.toString()}`)
    if (Array.isArray(data)) {
      if (!suche && !mood) appStore.setSongs(data)
      return data
    }
  } catch (error) {
    console.warn('Backend nicht erreichbar, nutze lokale Songs.', error)
  }

  return localFilter(suche, mood)
}

export async function getSong(id) {
  try {
    return await request(`/api/songs/${id}`)
  } catch {
    return appStore.songs.find(song => Number(song.id) === Number(id))
  }
}

export async function createSong(song) {
  const created = await fetchMultipart('/api/songs', 'POST', song)
  await getSongs()
  return created
}

export async function updateSong(id, song) {
  const updated = await fetchMultipart(`/api/songs/${id}`, 'PUT', song)
  await getSongs()
  return updated
}

export async function deleteSong(id) {
  await request(`/api/songs/${id}`, { method: 'DELETE' })
  await getSongs()
}
