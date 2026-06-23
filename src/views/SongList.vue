<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { appStore, moods } from '../store.js'
import { getSongs, deleteSong as deleteSongApi } from '../services/songService.js'
import { getPlaylists, likePlaylist } from '../services/playlistService.js'
import { resolveImageUrl } from '../services/api.js'

const route = useRoute()
const suche = ref('')
const mood = ref(String(route.query.mood || ''))
const songs = ref([])
const playlists = ref([])
const loading = ref(false)
const errorMessage = ref('')
const openFilter = ref(false)

const filteredSongs = computed(() => songs.value)

const matchingPlaylists = computed(() => {
  const selectedMood = String(mood.value || '')
  return playlists.value
    .filter(playlist => playlist.creatorId)
    .filter(playlist => !selectedMood || playlist.stimmungsKategorie === selectedMood)
    .filter(playlist => Array.isArray(playlist.songs) && playlist.songs.length > 0)
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
})

function setMood(value) {
  mood.value = value
  openFilter.value = false
}

async function loadSongsAndPlaylists() {
  loading.value = true
  errorMessage.value = ''
  try {
    const [songData, playlistData] = await Promise.all([
      getSongs(suche.value, mood.value),
      getPlaylists('', { mood: mood.value })
    ])
    songs.value = songData
    playlists.value = playlistData
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Musik konnte nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

async function deleteSong(id) {
  await deleteSongApi(id)
  await loadSongsAndPlaylists()
}

async function toggleLike(id) {
  await likePlaylist(id)
  await loadSongsAndPlaylists()
}

function playSong(song) {
  appStore.playSong(song, filteredSongs.value, song.emotionsKategorie)
}

function playPlaylist(playlist) {
  appStore.playPlaylist(playlist, playlist.stimmungsKategorie)
}

onMounted(loadSongsAndPlaylists)
watch([suche, mood], loadSongsAndPlaylists)
watch(() => route.query.mood, (value) => {
  mood.value = String(value || '')
})
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Musik finden</p>
    <h1 class="page-heading">Songs</h1>
    <p class="page-lead">Wähle eine Stimmung und starte direkt passende Musik. Darunter findest du passende Playlists nach Likes sortiert.</p>

    <section class="filter-panel filter-panel-songs filter-panel-mood-only">
      <input v-model="suche" placeholder="Titel oder Künstler suchen...">

      <div class="custom-select" :class="{ open: openFilter }">
        <button type="button" class="custom-select-trigger" @click="openFilter = !openFilter">
          <span>{{ mood || 'Alle Stimmungen' }}</span>
          <span class="custom-select-arrow">⌄</span>
        </button>
        <div v-if="openFilter" class="custom-select-menu">
          <button type="button" class="custom-select-option" :class="{ selected: mood === '' }" @click="setMood('')">Alle Stimmungen</button>
          <button v-for="item in moods" :key="item" type="button" class="custom-select-option" :class="{ selected: mood === item }" @click="setMood(item)">
            {{ item }}
          </button>
        </div>
      </div>

      <RouterLink v-if="appStore.isAdmin" to="/songs/create" class="primary-pill">Neuer Song</RouterLink>
    </section>

    <p v-if="loading" class="empty-state">Musik wird geladen...</p>
    <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>

    <section v-if="!loading && filteredSongs.length" class="list-card">
      <div v-for="song in filteredSongs" :key="song.id" class="song-row song-row-simple song-row-mood-only">
        <button type="button" class="icon-btn" @click="playSong(song)">▶</button>

        <div class="song-title">
          <strong>{{ song.titel }}</strong>
          <span>{{ song.kuenstler }}</span>
        </div>

        <small class="hide-mobile">{{ song.emotionsKategorie || 'Keine Stimmung' }}</small>

        <div class="song-actions">
          <RouterLink v-if="appStore.isAdmin" :to="`/songs/${song.id}/edit`" class="icon-btn">✎</RouterLink>
          <button v-if="appStore.isAdmin" type="button" class="icon-btn" @click="deleteSong(song.id)">×</button>
        </div>
      </div>
    </section>

    <p v-if="!loading && !filteredSongs.length" class="empty-state">
      {{ mood ? `Für ${mood} gibt es noch keine Songs. Wähle eine andere Stimmung oder lade als Admin passende Musik hoch.` : 'Noch keine Songs vorhanden.' }}
    </p>

    <section v-if="!loading && matchingPlaylists.length" class="spotify-section playlist-suggestions-section">
      <div class="section-title-row">
        <div>
          <h2>{{ mood ? `Playlists für ${mood}` : 'Beliebte Playlists' }}</h2>
          <p>Nach Likes sortiert. Wenn dir eine gefällt, speicherst du sie mit einem Like in deiner Playlist-Sammlung.</p>
        </div>
      </div>

      <div class="spotify-grid">
        <article v-for="playlist in matchingPlaylists" :key="playlist.id" class="spotify-card">
          <RouterLink :to="`/playlists/${playlist.id}`" class="playlist-card-link">
            <div class="album-cover playlist-cover">
              <img v-if="playlist.coverImageUrl" :src="resolveImageUrl(playlist.coverImageUrl)" alt="Playlist Cover">
              <span v-else>▤</span>
            </div>
            <h3>{{ playlist.titel }}</h3>
            <p>{{ playlist.stimmungsKategorie }}</p>
            <div class="playlist-creator-mini">
              <span class="creator-avatar creator-avatar-small">
                <img v-if="playlist.creatorImageUrl" :src="resolveImageUrl(playlist.creatorImageUrl)" alt="Profilbild">
                <template v-else>{{ (playlist.creatorName || 'U').charAt(0).toUpperCase() }}</template>
              </span>
              <small>von {{ playlist.creatorName || 'Unbekannt' }}</small>
            </div>
          </RouterLink>

          <button type="button" class="card-play" @click="playPlaylist(playlist)">▶</button>

          <div class="card-meta">
            <span class="badge like-badge">{{ playlist.likes || 0 }} Likes</span>
            <span class="badge">{{ playlist.songs?.length || 0 }} Songs</span>
          </div>

          <div class="card-actions">
            <button type="button" class="ghost-pill" @click="toggleLike(playlist.id)">
              {{ playlist.likedByCurrentUser ? 'Gespeichert' : 'Speichern' }}
            </button>
            <button type="button" class="ghost-pill" @click="playPlaylist(playlist)">Abspielen</button>
            <RouterLink :to="`/playlists/${playlist.id}`" class="text-button">Öffnen</RouterLink>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
