import { appStore } from '../store.js'
import { request } from './api.js'

function withSongs(playlist) {
  const songs = playlist.songs?.length ? playlist.songs : appStore.getSongsForPlaylist(playlist)
  return { ...playlist, songs, songIds: playlist.songIds || songs.map(song => song.id) }
}

export async function getPlaylists() {
  try {
    const data = await request('/api/playlists')
    if (Array.isArray(data)) {
      const playlists = data.map(item => ({ ...item, likes: item.likes ?? 0 }))
      appStore.setPlaylists(playlists)
      return playlists
    }
  } catch (error) {
    console.warn('Backend nicht erreichbar, nutze lokale Playlists.', error)
  }

  return [...appStore.playlists]
    .map(withSongs)
    .sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0))
}

export async function getPlaylist(id) {
  try {
    return await request(`/api/playlists/${id}`)
  } catch {
    const playlist = appStore.playlists.find(item => Number(item.id) === Number(id))
    return playlist ? withSongs(playlist) : null
  }
}

export async function createPlaylist(playlist) {
  try {
    const created = await request('/api/playlists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...playlist, owner: appStore.displayName })
    })
    await getPlaylists()
    return created
  } catch (error) {
    console.warn('Backend nicht erreichbar, speichere Playlist lokal.', error)
    const newPlaylist = { ...playlist, id: Date.now(), likes: Number(playlist.likes || 0), owner: appStore.displayName }
    appStore.playlists.push(newPlaylist)
    appStore.savePlaylists()
    return newPlaylist
  }
}

export async function updatePlaylist(id, playlist) {
  try {
    const updated = await request(`/api/playlists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playlist)
    })
    await getPlaylists()
    return updated
  } catch (error) {
    console.warn('Backend nicht erreichbar, aktualisiere Playlist lokal.', error)
    const index = appStore.playlists.findIndex(item => Number(item.id) === Number(id))
    if (index !== -1) appStore.playlists[index] = { ...appStore.playlists[index], ...playlist, id: Number(id) }
    appStore.savePlaylists()
    return appStore.playlists[index]
  }
}

export async function likePlaylist(id) {
  try {
    const updated = await request(`/api/playlists/${id}/like`, { method: 'POST' })
    const index = appStore.playlists.findIndex(item => Number(item.id) === Number(id))
    if (index !== -1) appStore.playlists[index] = updated
    appStore.markPlaylistLiked(id)
    appStore.savePlaylists()
    return updated
  } catch (error) {
    console.warn('Backend nicht erreichbar, like lokal.', error)
    appStore.togglePlaylistLikeLocal(id)
  }
}

export async function deletePlaylist(id) {
  try {
    await request(`/api/playlists/${id}`, { method: 'DELETE' })
    await getPlaylists()
  } catch (error) {
    console.warn('Backend nicht erreichbar, lösche Playlist lokal.', error)
    appStore.playlists = appStore.playlists.filter(item => Number(item.id) !== Number(id))
    appStore.savePlaylists()
  }
}
