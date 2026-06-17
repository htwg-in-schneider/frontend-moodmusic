import { reactive } from 'vue'
import { loginUser, registerUser, updateMe } from './services/authService.js'
import { resolveAudioUrl } from './services/api.js'

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

const defaultSongs = []
const defaultPlaylists = []

const savedUser = readJson('moodmusic_user', null)
const savedSongs = defaultSongs
const savedPlaylists = defaultPlaylists
const savedLikes = readJson('moodmusic_playlist_likes', [])
const savedHistory = readJson('moodmusic_mood_history', [])

const audio = typeof Audio !== 'undefined' ? new Audio() : null

function normalizeRole(role) {
  return String(role || 'USER').toUpperCase()
}

function normalizeUser(user) {
  if (!user) return null
  return {
    ...user,
    role: normalizeRole(user.role),
    address: user.address ?? user.adresse ?? ''
  }
}

function uniqueById(items) {
  return items.filter((item, index, array) => array.findIndex(other => Number(other.id) === Number(item.id)) === index)
}

export const appStore = reactive({
  user: normalizeUser(savedUser),
  songs: savedSongs,
  playlists: savedPlaylists,
  playlistLikes: savedLikes,
  moodHistory: savedHistory,
  currentSong: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  shuffle: false,
  miniPlayerVisible: false,

  get isAuthenticated() {
    return !!this.user
  },

  get isAdmin() {
    return this.user?.role === 'ADMIN'
  },

  get displayName() {
    return this.user?.name || 'Demo User'
  },

  get initial() {
    return this.displayName.charAt(0).toUpperCase()
  },

  async login(email, password) {
    const user = normalizeUser(await loginUser(email, password))
    this.user = user
    writeJson('moodmusic_user', user)
    return user
  },

  async register(payload) {
    const user = normalizeUser(await registerUser(payload))
    this.user = user
    writeJson('moodmusic_user', user)
    return user
  },

  async updateProfile(payload) {
    if (!this.user?.id) return
    const user = normalizeUser(await updateMe(this.user.id, { ...this.user, ...payload }))
    this.user = user
    writeJson('moodmusic_user', user)
  },

  logout() {
    if (audio) {
      audio.pause()
      audio.src = ''
    }
    this.user = null
    this.currentSong = null
    this.queue = []
    this.queueIndex = 0
    this.isPlaying = false
    this.miniPlayerVisible = false
    localStorage.removeItem('moodmusic_user')
  },

  setSongs(songs) {
    this.songs = Array.isArray(songs) ? songs : []
    writeJson('moodmusic_songs', this.songs)
  },

  setPlaylists(playlists) {
    this.playlists = Array.isArray(playlists) ? playlists : []
    writeJson('moodmusic_playlists', this.playlists)
  },

  saveSongs() {
    writeJson('moodmusic_songs', this.songs)
  },

  savePlaylists() {
    writeJson('moodmusic_playlists', this.playlists)
  },

  addMoodHistory(mood) {
    this.moodHistory.unshift({ id: Date.now(), mood, createdAt: new Date().toISOString() })
    this.moodHistory = this.moodHistory.slice(0, 20)
    writeJson('moodmusic_mood_history', this.moodHistory)
  },

  getSongsByMood(mood) {
    const value = String(mood || '').toLowerCase()
    if (!value) return this.songs
    return this.songs.filter(song => {
      const emotion = String(song.emotionsKategorie || '').toLowerCase()
      const genre = String(song.genre || '').toLowerCase()
      return emotion.includes(value) || genre.includes(value) || value.includes(emotion)
    })
  },

  getSongsForPlaylist(playlist) {
    if (Array.isArray(playlist?.songs) && playlist.songs.length) return playlist.songs
    const ids = playlist?.songIds || []
    return this.songs.filter(song => ids.map(Number).includes(Number(song.id)))
  },

  hasLikedPlaylist(playlistId) {
    return this.playlistLikes.includes(Number(playlistId))
  },

  markPlaylistLiked(playlistId) {
    const id = Number(playlistId)
    if (!this.playlistLikes.includes(id)) {
      this.playlistLikes.push(id)
      writeJson('moodmusic_playlist_likes', this.playlistLikes)
    }
  },

  togglePlaylistLikeLocal(playlistId) {
    const id = Number(playlistId)
    const playlist = this.playlists.find(p => Number(p.id) === id)
    if (!playlist) return

    if (this.playlistLikes.includes(id)) {
      this.playlistLikes = this.playlistLikes.filter(item => item !== id)
      playlist.likes = Math.max(0, Number(playlist.likes || 0) - 1)
    } else {
      this.playlistLikes.push(id)
      playlist.likes = Number(playlist.likes || 0) + 1
    }

    writeJson('moodmusic_playlist_likes', this.playlistLikes)
    this.savePlaylists()
  },

  startAudio() {
    if (!audio || !this.currentSong) return
    const src = resolveAudioUrl(this.currentSong.audioUrl)
    if (!src) {
      this.isPlaying = false
      console.warn('Kein audioUrl für Song:', this.currentSong)
      return
    }

    if (audio.src !== src) audio.src = src
    audio.play()
      .then(() => { this.isPlaying = true })
      .catch(error => {
        console.warn('Audio konnte nicht abgespielt werden:', error)
        this.isPlaying = false
      })
  },

  playSong(song, queue = null) {
    const cleanQueue = uniqueById(queue && queue.length ? queue : [song])
    this.queue = cleanQueue
    this.queueIndex = cleanQueue.findIndex(item => Number(item.id) === Number(song.id))
    if (this.queueIndex < 0) this.queueIndex = 0
    this.currentSong = cleanQueue[this.queueIndex] || song
    this.miniPlayerVisible = true
    this.startAudio()
  },

  playPlaylist(playlist) {
    const playlistSongs = this.getSongsForPlaylist(playlist)
    if (!playlistSongs.length) return
    this.queue = playlistSongs
    this.queueIndex = 0
    this.currentSong = playlistSongs[0]
    this.miniPlayerVisible = true
    this.startAudio()
  },

  togglePlay() {
    if (!audio) return
    if (!this.currentSong && this.songs.length) {
      this.playSong(this.songs[0], this.songs)
      return
    }
    if (this.isPlaying) {
      audio.pause()
      this.isPlaying = false
    } else {
      this.startAudio()
    }
  },

  nextSong() {
    if (!this.queue.length) return
    if (this.shuffle) {
      this.queueIndex = Math.floor(Math.random() * this.queue.length)
    } else {
      this.queueIndex = (this.queueIndex + 1) % this.queue.length
    }
    this.currentSong = this.queue[this.queueIndex]
    this.startAudio()
  },

  previousSong() {
    if (!this.queue.length) return
    this.queueIndex = (this.queueIndex - 1 + this.queue.length) % this.queue.length
    this.currentSong = this.queue[this.queueIndex]
    this.startAudio()
  },

  toggleShuffle() {
    this.shuffle = !this.shuffle
  },

  closeMiniPlayer() {
    this.miniPlayerVisible = false
  }
})

if (audio) {
  audio.addEventListener('ended', () => appStore.nextSong())
}

export const moods = ['Fokus', 'Lernen', 'Training', 'Entspannt', 'Glücklich', 'Traurig', 'Energiegeladen', 'Chillen']
export const genres = ['Pop', 'Hip-Hop', 'Electronic', 'Klassik', 'Rock', 'Jazz', 'Lo-Fi', 'R&B']
