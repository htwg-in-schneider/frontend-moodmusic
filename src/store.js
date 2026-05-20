import { reactive } from 'vue'

export const songStore = reactive({
  songs: [
    { id: 1, titel: 'Blinding Lights', kuenstler: 'The Weeknd', genre: 'Pop', bpm: 171, emotionsKategorie: 'Energiegeladen', dateiName: 'blinding_lights.mp3' },
    { id: 2, titel: 'Clair de Lune', kuenstler: 'Debussy', genre: 'Klassik', bpm: 72, emotionsKategorie: 'Entspannt', dateiName: 'clair_de_lune.mp3' },
    { id: 3, titel: 'Lose Yourself', kuenstler: 'Eminem', genre: 'Hip-Hop', bpm: 171, emotionsKategorie: 'Fokus', dateiName: 'lose_yourself.mp3' },
    { id: 4, titel: 'Someone Like You', kuenstler: 'Adele', genre: 'Pop', bpm: 67, emotionsKategorie: 'Traurig', dateiName: 'someone_like_you.mp3' },
    { id: 5, titel: 'Levels', kuenstler: 'Avicii', genre: 'Electronic', bpm: 126, emotionsKategorie: 'Glücklich', dateiName: 'levels.mp3' },
  ],
  nextSongId: 6,

  playlists: [
    { id: 1, titel: 'Workout Energy', stimmungsKategorie: 'Energiegeladen', songIds: [1, 3, 5] },
    { id: 2, titel: 'Chill Vibes', stimmungsKategorie: 'Entspannt', songIds: [2, 4] },
  ],
  nextPlaylistId: 3,

  // Song Methoden
  addSong(song) {
    this.songs.push({ ...song, id: this.nextSongId++ })
  },
  deleteSong(id) {
    this.songs = this.songs.filter(s => s.id !== id)
    this.playlists.forEach(p => {
      p.songIds = p.songIds.filter(sid => sid !== id)
    })
  },
  getSong(id) {
    return this.songs.find(s => s.id === Number(id))
  },
  updateSong(id, updatedSong) {
    const index = this.songs.findIndex(s => s.id === Number(id))
    if (index !== -1) {
      this.songs[index] = { ...this.songs[index], ...updatedSong }
    }
  },

  // Playlist Methoden
addPlaylist(playlist) {
  this.playlists.push({
    ...playlist,
    id: this.nextPlaylistId++,
    songIds: [...playlist.songIds]
  })
},

deletePlaylist(id) {
  this.playlists = this.playlists.filter(p => p.id !== Number(id))
},

getPlaylist(id) {
  return this.playlists.find(p => p.id === Number(id))
},

updatePlaylist(id, updatedPlaylist) {
  const index = this.playlists.findIndex(p => p.id === Number(id))

  if (index !== -1) {
    this.playlists[index] = {
      ...this.playlists[index],
      ...updatedPlaylist,
      songIds: [...updatedPlaylist.songIds]
    }
  }
},

getSongsForPlaylist(playlistId) {
  const playlist = this.getPlaylist(playlistId)

  if (!playlist || !Array.isArray(playlist.songIds)) {
    return []
  }

  return this.songs.filter(song => playlist.songIds.includes(song.id))
}
})