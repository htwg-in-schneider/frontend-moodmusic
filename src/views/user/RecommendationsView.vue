<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { appStore } from '../../store.js'
import { getSongs } from '../../services/songService.js'
import { getPlaylists, likePlaylist } from '../../services/playlistService.js'
import { resolveImageUrl } from '../../services/api.js'

const route = useRoute()
const router = useRouter()
const showAllSongs = ref(false)
const showAllPlaylists = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const mood = computed(() => String(route.query.mood || appStore.currentMood || '').trim())

const recommendedSongs = computed(() => appStore.getSongsByMood(mood.value))
const visibleSongs = computed(() => showAllSongs.value ? recommendedSongs.value : recommendedSongs.value.slice(0, 6))

const matchingPlaylists = computed(() => {
  const m = mood.value.toLowerCase()
  if (!m) return []
  return appStore.playlists
    .filter(p => String(p.stimmungsKategorie || '').toLowerCase().includes(m))
    .sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0))
})

const visiblePlaylists = computed(() => showAllPlaylists.value ? matchingPlaylists.value : matchingPlaylists.value.slice(0, 4))

async function loadData() {
  loading.value = true
  errorMessage.value = ''
  try {
    await getSongs()
    await getPlaylists()
    if (mood.value) appStore.setCurrentMood(mood.value)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Empfehlungen konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

function playSong(song) {
  appStore.playSong(song, recommendedSongs.value, mood.value)
}

function playPlaylist(playlist) {
  appStore.playPlaylist(playlist, mood.value)
}

async function toggleLike(id) {
  await likePlaylist(id)
  await getPlaylists()
}

onMounted(loadData)
watch(() => route.query.mood, loadData)
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Empfehlungen</p>
    <h1 class="page-heading">{{ mood ? `Für ${mood}` : 'Wähle zuerst eine Stimmung' }}</h1>
    <p class="page-lead">Hier siehst du nur echte Treffer. Wenn nichts passt, wird nicht mehr künstlich alles angezeigt.</p>

    <div class="page-actions">
      <button type="button" class="ghost-pill" @click="router.back()">Zurück</button>
      <RouterLink to="/dashboard" class="primary-pill">Mood ändern</RouterLink>
    </div>

    <p v-if="loading" class="empty-state">Empfehlungen werden geladen...</p>
    <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>

    <section v-if="!loading" class="spotify-section">
      <div class="section-title-row">
        <div>
          <h2>Songs für dich</h2>
          <p>{{ recommendedSongs.length }} passende Songs</p>
        </div>
        <button v-if="recommendedSongs.length > 6" class="text-button" @click="showAllSongs = !showAllSongs">
          {{ showAllSongs ? 'Weniger' : 'Mehr anzeigen' }}
        </button>
      </div>

      <p v-if="!mood" class="empty-state">Gehe zurück zum Dashboard und wähle aus, wie du dich fühlst.</p>
      <p v-else-if="!recommendedSongs.length" class="empty-state">
        Für diese Stimmung gibt es noch keine Songs. Lade als Admin passende Songs mit der Stimmung „{{ mood }}“ hoch oder probiere eine andere Auswahl.
      </p>

      <div v-else class="spotify-grid">
        <article v-for="song in visibleSongs" :key="song.id" class="spotify-card">
          <div class="album-cover">♪</div>
          <button type="button" class="card-play" @click="playSong(song)">▶</button>
          <h3>{{ song.titel }}</h3>
          <p>{{ song.kuenstler }}</p>
          <div class="card-meta">
            <span class="badge">{{ song.genre }}</span>
            <span class="badge">{{ song.emotionsKategorie }}</span>
          </div>
        </article>
      </div>
    </section>

    <section v-if="!loading" class="spotify-section">
      <div class="section-title-row">
        <div>
          <h2>Passende Playlists</h2>
          <p>Nach Stimmung gefiltert und nach Likes sortiert.</p>
        </div>
        <button v-if="matchingPlaylists.length > 4" class="text-button" @click="showAllPlaylists = !showAllPlaylists">
          {{ showAllPlaylists ? 'Weniger' : 'Mehr anzeigen' }}
        </button>
      </div>

      <p v-if="mood && !matchingPlaylists.length" class="empty-state">Noch keine Playlists für „{{ mood }}“ vorhanden.</p>

      <div v-else class="spotify-grid">
        <article v-for="playlist in visiblePlaylists" :key="playlist.id" class="spotify-card playlist-card-clickable">
          <RouterLink :to="`/playlists/${playlist.id}`" class="playlist-card-link">
            <div class="album-cover playlist-cover">
              <img v-if="playlist.coverImageUrl" :src="resolveImageUrl(playlist.coverImageUrl)" alt="Playlist Cover">
              <span v-else>▤</span>
            </div>
            <h3>{{ playlist.titel }}</h3>
            <p>{{ playlist.stimmungsKategorie }} · {{ playlist.songs?.length || 0 }} Songs</p>
            <small>von {{ playlist.creatorName || 'Unbekannt' }}</small>
          </RouterLink>
          <button type="button" class="card-play" @click="playPlaylist(playlist)">▶</button>
          <div class="card-actions">
            <button type="button" class="ghost-pill" @click="toggleLike(playlist.id)">
              {{ playlist.likedByCurrentUser ? 'Liked' : 'Like' }} · {{ playlist.likes || 0 }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
