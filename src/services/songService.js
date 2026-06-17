import { appStore } from '../store.js'
import { request, API_BASE, authHeaders } from './api.js'

function localFilter(suche = '', genre = '', emotion = '') {
  const q = String(suche || '').toLowerCase()
  return appStore.songs.filter(song => {
    const matchesSearch = !q || `${song.titel} ${song.kuenstler}`.toLowerCase().includes(q)
    const matchesGenre = !genre || song.genre === genre
    const matchesEmotion = !emotion || song.emotionsKategorie === emotion
    return matchesSearch && matchesGenre && matchesEmotion
  })
}

function buildSongFormData(song) {
  const formData = new FormData()
  formData.append('titel', song.titel || '')
  formData.append('kuenstler', song.kuenstler || '')
  formData.append('genre', song.genre || '')
  if (song.emotionsKategorie) formData.append('emotionsKategorie', song.emotionsKategorie)
  if (song.audioUrl) formData.append('audioUrl', song.audioUrl)
  if (song.dateiName) formData.append('dateiName', song.dateiName)
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

export async function getSongs(suche = '', genre = '', emotion = '') {
  const params = new URLSearchParams()
  if (suche) params.append('suche', suche)
  if (genre) params.append('genre', genre)
  if (emotion) params.append('emotion', emotion)

  try {
    const data = await request(`/api/songs?${params.toString()}`)
    if (Array.isArray(data)) {
      if (!suche && !genre && !emotion) appStore.setSongs(data)
      return data
    }
  } catch (error) {
    console.warn('Backend nicht erreichbar, nutze lokale Songs.', error)
  }

  return localFilter(suche, genre, emotion)
}

export async function getSong(id) {
  try {
    return await request(`/api/songs/${id}`)
  } catch {
    return appStore.songs.find(song => Number(song.id) === Number(id))
  }
}

export async function createSong(song) {
  try {
    const created = await fetchMultipart('/api/songs', 'POST', song)
    await getSongs()
    return created
  } catch (error) {
    console.warn('Backend nicht erreichbar, speichere Song lokal.', error)
    const newSong = { ...song, id: Date.now(), file: undefined }
    appStore.songs.push(newSong)
    appStore.saveSongs()
    return newSong
  }
}

export async function updateSong(id, song) {
  try {
    const updated = await fetchMultipart(`/api/songs/${id}`, 'PUT', song)
    await getSongs()
    return updated
  } catch (error) {
    console.warn('Backend nicht erreichbar, aktualisiere Song lokal.', error)
    const index = appStore.songs.findIndex(item => Number(item.id) === Number(id))
    if (index !== -1) appStore.songs[index] = { ...appStore.songs[index], ...song, id: Number(id), file: undefined }
    appStore.saveSongs()
    return appStore.songs[index]
  }
}

export async function deleteSong(id) {
  try {
    await request(`/api/songs/${id}`, { method: 'DELETE' })
    await getSongs()
  } catch (error) {
    console.warn('Backend nicht erreichbar, lösche Song lokal.', error)
    appStore.songs = appStore.songs.filter(song => Number(song.id) !== Number(id))
    appStore.playlists.forEach(playlist => {
      playlist.songIds = (playlist.songIds || []).filter(songId => Number(songId) !== Number(id))
    })
    appStore.saveSongs()
    appStore.savePlaylists()
  }
}
