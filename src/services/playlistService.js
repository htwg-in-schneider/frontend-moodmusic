const API_URL = 'http://localhost:8080/api/playlists'

export async function getPlaylists() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Playlists konnten nicht geladen werden')
  }

  return await response.json()
}

export async function getPlaylist(id) {
  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error('Playlist konnte nicht geladen werden')
  }

  return await response.json()
}

export async function createPlaylist(playlist) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(playlist)
  })

  if (!response.ok) {
    throw new Error('Playlist konnte nicht erstellt werden')
  }

  return await response.json()
}

export async function updatePlaylist(id, playlist) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(playlist)
  })

  if (!response.ok) {
    throw new Error('Playlist konnte nicht aktualisiert werden')
  }

  return await response.json()
}

export async function deletePlaylist(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Playlist konnte nicht gelöscht werden')
  }
}