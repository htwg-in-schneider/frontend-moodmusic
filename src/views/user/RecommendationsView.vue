<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { appStore } from '../../store.js'
import { getSongs } from '../../services/songService.js'
import { getPlaylists, likePlaylist } from '../../services/playlistService.js'

const route = useRoute()
const router = useRouter()
const showAllSongs = ref(false)
const showAllPlaylists = ref(false)
const loading = ref(false)

const mood = computed(() => route.query.mood || 'Fokus')

const recommendedSongs = computed(() => {
  const result = appStore.getSongsByMood(mood.value)
  return result.length ? result : appStore.songs
})

const visibleSongs = computed(() => showAllSongs.value ? recommendedSongs.value : recommendedSongs.value.slice(0, 6))

const matchingPlaylists = computed(() => {
  const m = String(mood.value || '').toLowerCase()
  const exact = appStore.playlists.filter(p => String(p.stimmungsKategorie || '').toLowerCase().includes(m))
  const rest = appStore.playlists.filter(p => !String(p.stimmungsKategorie || '').toLowerCase().includes(m))
  return [...exact, ...rest]
    .filter((playlist, index, array) => array.findIndex(item => Number(item.id) === Number(playlist.id)) === index)
    .sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0))
})

const visiblePlaylists = computed(() => showAllPlaylists.value ? matchingPlaylists.value : matchingPlaylists.value.slice(0, 4))

async function loadData() {
  loading.value = true
  try {
    await getSongs()
    await getPlaylists()
  } finally {
    loading.value = false
  }
}

function playSong(song) {
  appStore.playSong(song, recommendedSongs.value)
}

function playPlaylist(playlist) {
  appStore.playPlaylist(playlist)
}

async function toggleLike(id) {
  await likePlaylist(id)
  await getPlaylists()
}

onMounted(loadData)
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Empfehlungen</p>
    <h1 class="page-heading">Für {{ mood }}</h1>
    <p class="page-lead">Oben findest du passende Songs. Darunter stehen Playlists — nach Likes und Stimmung sortiert.</p>

    <div class="page-actions">
      <button type="button" class="ghost-pill" @click="router.back()">Zurück</button>
      <RouterLink to="/dashboard" class="primary-pill">Mood ändern</RouterLink>
    </div>

    <p v-if="loading" class="empty-state">Empfehlungen werden geladen...</p>

    <section class="spotify-section">
      <div class="section-title-row">
        <div>
          <h2>Songs für dich</h2>
          <p>{{ recommendedSongs.length }} passende Songs</p>
        </div>
        <button v-if="recommendedSongs.length > 6" class="text-button" @click="showAllSongs = !showAllSongs">
          {{ showAllSongs ? 'Weniger' : 'Mehr anzeigen' }}
        </button>
      </div>

      <div class="spotify-grid">
        <article v-for="song in visibleSongs" :key="song.id" class="spotify-card">
          <div class="album-cover">♪</div>
          <button type="button" class="card-play" @click="playSong(song)">▶</button>
          <h3>{{ song.titel }}</h3>
          <p>{{ song.kuenstler }}</p>
          <div class="card-meta">
            <span class="badge">{{ song.genre }}</span>
          </div>
        </article>
      </div>
    </section>

    <section class="spotify-section">
      <div class="section-title-row">
        <div>
          <h2>Beliebte Playlists</h2>
          <p>Je mehr Likes, desto weiter oben.</p>
        </div>
        <button v-if="matchingPlaylists.length > 4" class="text-button" @click="showAllPlaylists = !showAllPlaylists">
          {{ showAllPlaylists ? 'Weniger' : 'Mehr anzeigen' }}
        </button>
      </div>

      <div class="spotify-grid">
        <article v-for="playlist in visiblePlaylists" :key="playlist.id" class="spotify-card">
          <div class="album-cover">▤</div>
          <button type="button" class="card-play" @click="playPlaylist(playlist)">▶</button>
          <h3>{{ playlist.titel }}</h3>
          <p>{{ playlist.stimmungsKategorie }} · {{ playlist.songIds?.length || playlist.songs?.length || 0 }} Songs</p>
          <div class="card-meta">
            <span class="badge like-badge">{{ playlist.likes || 0 }} Likes</span>
          </div>
          <div class="card-actions">
            <button type="button" class="ghost-pill" @click="toggleLike(playlist.id)">
              {{ appStore.hasLikedPlaylist(playlist.id) ? 'Liked' : 'Like' }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
