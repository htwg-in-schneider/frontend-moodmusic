const API_URL = 'http://localhost:8080/api/songs'

export async function getSongs(suche = '', genre = '', emotion = '') {
  const params = new URLSearchParams()

  if (suche) params.append('suche', suche)
  if (genre) params.append('genre', genre)
  if (emotion) params.append('emotion', emotion)

  const response = await fetch(`${API_URL}?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Songs konnten nicht geladen werden')
  }

  return await response.json()
}

export async function getSong(id) {
  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error('Song konnte nicht geladen werden')
  }

  return await response.json()
}

export async function createSong(song) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(song)
  })

  if (!response.ok) {
    throw new Error('Song konnte nicht erstellt werden')
  }

  return await response.json()
}

export async function updateSong(id, song) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(song)
  })

  if (!response.ok) {
    throw new Error('Song konnte nicht aktualisiert werden')
  }

  return await response.json()
}

export async function deleteSong(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Song konnte nicht gelöscht werden')
  }
}