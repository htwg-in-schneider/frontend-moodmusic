import { reactive } from 'vue'
import { loginUser, registerUser, updateMe } from './services/authService.js'
import { resolveAudioUrl } from './services/api.js'
import { recordListen } from './services/historyService.js'

export const moods = ['Fokus', 'Entspannen', 'Glücklich', 'Traurig', 'Workout', 'Wütend']

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

const audio = typeof Audio !== 'undefined' ? new Audio() : null

function normalizeRole(role) {
  return String(role || 'USER').toUpperCase()
}

function normalizeUser(user) {
  if (!user || !user.authToken) return null
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
  user: normalizeUser(readJson('moodmusic_user', null)),
  songs: [],
  playlists: [],
  moodHistory: readJson('moodmusic_mood_history', []),
  dailyHistory: [],
  currentMood: localStorage.getItem('moodmusic_current_mood') || '',
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

  setUser(user) {
    this.user = normalizeUser(user)
    writeJson('moodmusic_user', this.user)
  },

  logout() {
    if (audio) {
      audio.pause()
      audio.currentTime = 0
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
  },

  setPlaylists(playlists) {
    this.playlists = Array.isArray(playlists) ? playlists : []
  },

  setCurrentMood(mood) {
    this.currentMood = mood || ''
    localStorage.setItem('moodmusic_current_mood', this.currentMood)
  },

  addMoodHistory(mood) {
    if (!mood) return
    this.moodHistory.unshift({ id: Date.now(), mood, createdAt: new Date().toISOString() })
    this.moodHistory = this.moodHistory.slice(0, 20)
    writeJson('moodmusic_mood_history', this.moodHistory)
  },

  setDailyHistory(history) {
    this.dailyHistory = Array.isArray(history) ? history : []
  },

  getSongsByMood(mood) {
    const value = String(mood || '').toLowerCase()
    if (!value) return []
    return this.songs.filter(song => String(song.emotionsKategorie || '').toLowerCase() === value)
  },

  getSongsForPlaylist(playlist) {
    if (Array.isArray(playlist?.songs) && playlist.songs.length) return playlist.songs
    const ids = playlist?.songIds || []
    return this.songs.filter(song => ids.map(Number).includes(Number(song.id)))
  },

  hasLikedPlaylist(playlistId) {
    const playlist = this.playlists.find(item => Number(item.id) === Number(playlistId))
    return !!playlist?.likedByCurrentUser
  },

  async logListen(song) {
    if (!song?.id || !this.user?.id) return
    try {
      await recordListen(song.id, this.currentMood || song.emotionsKategorie || '')
    } catch (error) {
      console.warn('Hörverlauf konnte nicht gespeichert werden.', error)
    }
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
      .then(() => {
        this.isPlaying = true
        this.logListen(this.currentSong)
      })
      .catch(error => {
        console.warn('Audio konnte nicht abgespielt werden:', error)
        this.isPlaying = false
      })
  },

  playSong(song, queue = null, mood = '') {
    if (mood) this.setCurrentMood(mood)
    const cleanQueue = uniqueById(queue && queue.length ? queue : [song])
    this.queue = cleanQueue
    this.queueIndex = cleanQueue.findIndex(item => Number(item.id) === Number(song.id))
    if (this.queueIndex < 0) this.queueIndex = 0
    this.currentSong = cleanQueue[this.queueIndex] || song
    this.miniPlayerVisible = true
    this.startAudio()
  },

  playPlaylist(playlist, mood = '') {
    if (mood) this.setCurrentMood(mood)
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
    if (this.shuffle) this.queueIndex = Math.floor(Math.random() * this.queue.length)
    else this.queueIndex = (this.queueIndex + 1) % this.queue.length
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
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      audio.src = ''
    }
    this.currentSong = null
    this.queue = []
    this.queueIndex = 0
    this.isPlaying = false
    this.miniPlayerVisible = false
  }
})

if (audio) audio.addEventListener('ended', () => appStore.nextSong())
