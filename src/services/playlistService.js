import { appStore } from '../store.js'
import { request, API_BASE, authHeaders } from './api.js'

function buildPlaylistFormData(playlist) {
  const formData = new FormData()
  formData.append('titel', playlist.titel || '')
  formData.append('stimmungsKategorie', playlist.stimmungsKategorie || '')
  formData.append('description', playlist.description || '')
  formData.append('songIds', (playlist.songIds || []).join(','))
  if (playlist.coverFile) formData.append('cover', playlist.coverFile)
  return formData
}

async function fetchMultipart(path, method, playlist) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: buildPlaylistFormData(playlist)
  })
  if (!response.ok) {
    let message = 'Playlist konnte nicht gespeichert werden.'
    try { message = (await response.json()).message || message } catch {}
    throw new Error(message)
  }
  return response.json()
}

export async function getPlaylists(tab = '', options = {}) {
  const params = new URLSearchParams()
  if (tab) params.set('tab', tab)
  if (options.q) params.set('q', options.q)
  if (options.mood) params.set('mood', options.mood)

  const path = `/api/playlists${params.toString() ? `?${params.toString()}` : ''}`
  const data = await request(path)
  const playlists = Array.isArray(data) ? data.map(item => ({ ...item, likes: item.likes ?? 0 })) : []
  if (!tab) appStore.setPlaylists(playlists)
  return playlists
}

export async function getPlaylist(id) {
  return request(`/api/playlists/${id}`)
}

export async function createPlaylist(playlist) {
  const created = await fetchMultipart('/api/playlists', 'POST', playlist)
  await getPlaylists()
  return created
}

export async function updatePlaylist(id, playlist) {
  const updated = await fetchMultipart(`/api/playlists/${id}`, 'PUT', playlist)
  await getPlaylists()
  return updated
}

export async function likePlaylist(id) {
  const updated = await request(`/api/playlists/${id}/like`, { method: 'POST' })
  const index = appStore.playlists.findIndex(item => Number(item.id) === Number(id))
  if (index !== -1) appStore.playlists[index] = updated
  return updated
}

export async function deletePlaylist(id) {
  await request(`/api/playlists/${id}`, { method: 'DELETE' })
  await getPlaylists()
}
