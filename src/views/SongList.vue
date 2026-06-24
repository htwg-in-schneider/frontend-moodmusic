<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { appStore, moods } from '../store.js'
import { getSongs, deleteSong as deleteSongApi } from '../services/songService.js'
import { getPlaylists, likePlaylist } from '../services/playlistService.js'
import { resolveImageUrl } from '../services/api.js'

const route = useRoute()

const suche = ref('')
const playlistSearch = ref('')
const mood = ref(String(route.query.mood || ''))

const songs = ref([])
const playlists = ref([])

const loading = ref(false)
const errorMessage = ref('')
const openFilter = ref(false)

const showAllSongs = ref(false)
const showAllPlaylists = ref(false)

const filteredSongs = computed(() => {
  const q = String(suche.value || '').trim().toLowerCase()
  const selectedMood = String(mood.value || '').trim().toLowerCase()

  return songs.value.filter(song => {
    const title = String(song.titel || '').toLowerCase()
    const artist = String(song.kuenstler || '').toLowerCase()
    const songMood = String(song.emotionsKategorie || '').trim().toLowerCase()

    const matchesSearch = !q || title.includes(q) || artist.includes(q)
    const matchesMood = !selectedMood || songMood === selectedMood

    return matchesSearch && matchesMood
  })
})

const visibleSongs = computed(() =>
  showAllSongs.value ? filteredSongs.value : filteredSongs.value.slice(0, 10)
)

const hasMoreSongs = computed(() => filteredSongs.value.length > 10)

const matchingPlaylists = computed(() => {
  const selectedMood = String(mood.value || '').trim().toLowerCase()
  const q = String(playlistSearch.value || '').trim().toLowerCase()

  return playlists.value
    .filter(playlist => playlist.creatorId)
    .filter(playlist => {
      const playlistMood = String(playlist.stimmungsKategorie || '').trim().toLowerCase()
      const title = String(playlist.titel || '').toLowerCase()
      const creator = String(playlist.creatorName || '').toLowerCase()

      const matchesMood = !selectedMood || playlistMood === selectedMood
      const matchesSearch = !q || title.includes(q) || creator.includes(q)
      const hasSongs = Array.isArray(playlist.songs) && playlist.songs.length > 0

      return matchesMood && matchesSearch && hasSongs
    })
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
})

const visiblePlaylists = computed(() =>
  showAllPlaylists.value ? matchingPlaylists.value : matchingPlaylists.value.slice(0, 10)
)

const hasMorePlaylists = computed(() => matchingPlaylists.value.length > 10)

function setMood(value) {
  mood.value = value
  openFilter.value = false
  showAllSongs.value = false
  showAllPlaylists.value = false
}

async function loadSongsAndPlaylists() {
  loading.value = true
  errorMessage.value = ''

  try {
    const [songData, playlistData] = await Promise.all([
      getSongs('', mood.value),
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

watch(mood, () => {
  showAllSongs.value = false
  showAllPlaylists.value = false
  loadSongsAndPlaylists()
})

watch(suche, () => {
  showAllSongs.value = false
})

watch(playlistSearch, () => {
  showAllPlaylists.value = false
})

watch(() => route.query.mood, (value) => {
  mood.value = String(value || '')
})
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Musik finden</p>
    <h1 class="page-heading">Songs</h1>
    <p class="page-lead">
      Wähle eine Stimmung und starte direkt passende Musik. Darunter findest du passende Playlists nach Likes sortiert.
    </p>

    <section class="filter-panel filter-panel-songs filter-panel-mood-only song-search-panel">
      <input v-model="suche" placeholder="Titel oder Künstler suchen...">
      <input v-model="playlistSearch" placeholder="Playlist oder Ersteller suchen...">

      <div class="custom-select" :class="{ open: openFilter }">
        <button type="button" class="custom-select-trigger" @click="openFilter = !openFilter">
          <span>{{ mood || 'Alle Stimmungen' }}</span>
          <span class="custom-select-arrow">⌄</span>
        </button>

        <div v-if="openFilter" class="custom-select-menu">
          <button
            type="button"
            class="custom-select-option"
            :class="{ selected: mood === '' }"
            @click="setMood('')"
          >
            Alle Stimmungen
          </button>

          <button
            v-for="item in moods"
            :key="item"
            type="button"
            class="custom-select-option"
            :class="{ selected: mood === item }"
            @click="setMood(item)"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <RouterLink v-if="appStore.isAdmin" to="/songs/create" class="primary-pill">
        Neuer Song
      </RouterLink>
    </section>

    <p v-if="loading" class="empty-state">Musik wird geladen...</p>
    <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>

    <section v-if="!loading && filteredSongs.length" class="list-card">
      <div
        v-for="song in visibleSongs"
        :key="song.id"
        class="song-row song-row-simple song-row-mood-only"
      >
        <button type="button" class="icon-btn" @click="playSong(song)">▶</button>

        <div class="song-title">
          <strong>{{ song.titel }}</strong>
          <span>{{ song.kuenstler }}</span>
        </div>

        <small class="hide-mobile">{{ song.emotionsKategorie || 'Keine Stimmung' }}</small>

        <div class="song-actions">
          <RouterLink
            v-if="appStore.isAdmin"
            :to="`/songs/${song.id}/edit`"
            class="icon-btn"
          >
            ✎
          </RouterLink>

          <button
            v-if="appStore.isAdmin"
            type="button"
            class="icon-btn"
            @click="deleteSong(song.id)"
          >
            ×
          </button>
        </div>
      </div>
    </section>

    <div v-if="!loading && hasMoreSongs" class="show-more-row">
      <button
        type="button"
        class="ghost-pill show-more-button"
        @click="showAllSongs = !showAllSongs"
      >
        {{ showAllSongs ? 'Weniger Songs anzeigen' : `⋯ ${filteredSongs.length - 10} weitere Songs anzeigen` }}
      </button>
    </div>

    <p v-if="!loading && !filteredSongs.length" class="empty-state">
      {{ mood ? `Für ${mood} gibt es noch keine Songs. Wähle eine andere Stimmung oder lade als Admin passende Musik hoch.` : 'Noch keine Songs vorhanden.' }}
    </p>

    <section v-if="!loading && matchingPlaylists.length" class="spotify-section playlist-suggestions-section">
      <div class="section-title-row">
        <div>
          <h2>{{ mood ? `Playlists für ${mood}` : 'Beliebte Playlists' }}</h2>
        </div>
      </div>

      <div class="spotify-grid">
        <article
          v-for="playlist in visiblePlaylists"
          :key="playlist.id"
          class="spotify-card"
        >
          <RouterLink :to="`/playlists/${playlist.id}`" class="playlist-card-link">
            <div class="album-cover playlist-cover">
              <img
                v-if="playlist.coverImageUrl"
                :src="resolveImageUrl(playlist.coverImageUrl)"
                alt="Playlist Cover"
              >
              <span v-else>▤</span>
            </div>

            <h3>{{ playlist.titel }}</h3>
            <p>{{ playlist.stimmungsKategorie }}</p>

            <div class="playlist-creator-mini">
              <span class="creator-avatar creator-avatar-small">
                <img
                  v-if="playlist.creatorImageUrl"
                  :src="resolveImageUrl(playlist.creatorImageUrl)"
                  alt="Profilbild"
                >
                <template v-else>
                  {{ (playlist.creatorName || 'U').charAt(0).toUpperCase() }}
                </template>
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

            <button type="button" class="ghost-pill" @click="playPlaylist(playlist)">
              Abspielen
            </button>

            <RouterLink :to="`/playlists/${playlist.id}`" class="text-button">
              Öffnen
            </RouterLink>
          </div>
        </article>
      </div>

      <div v-if="hasMorePlaylists" class="show-more-row">
        <button
          type="button"
          class="ghost-pill show-more-button"
          @click="showAllPlaylists = !showAllPlaylists"
        >
          {{ showAllPlaylists ? 'Weniger Playlists anzeigen' : `⋯ ${matchingPlaylists.length - 10} weitere Playlists anzeigen` }}
        </button>
      </div>
    </section>
  </main>
</template>