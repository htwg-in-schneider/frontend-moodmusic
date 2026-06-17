<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { appStore } from '../store.js'
import { getPlaylists, deletePlaylist as deletePlaylistApi, likePlaylist } from '../services/playlistService.js'
import { getSongs } from '../services/songService.js'

const playlists = ref([])
const loading = ref(false)
const errorMessage = ref('')

const sortedPlaylists = computed(() => {
  return [...playlists.value].sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0))
})

async function loadData() {
  loading.value = true
  errorMessage.value = ''
  try {
    await getSongs()
    playlists.value = await getPlaylists()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Playlists konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

async function deletePlaylist(id) {
  await deletePlaylistApi(id)
  await loadData()
}

async function toggleLike(id) {
  await likePlaylist(id)
  playlists.value = await getPlaylists()
}

function playPlaylist(playlist) {
  appStore.playPlaylist(playlist)
}

onMounted(loadData)
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Community</p>
    <h1 class="page-heading">Playlists</h1>
    <p class="page-lead">Dezent wie Spotify: Cover, Titel, Stimmung, Likes. Beliebte Playlists stehen weiter oben.</p>

    <div class="page-actions">
      <RouterLink to="/playlists/create" class="primary-pill">Playlist erstellen</RouterLink>
    </div>

    <p v-if="loading" class="empty-state">Playlists werden geladen...</p>
    <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>

    <section v-if="!loading && sortedPlaylists.length" class="spotify-section">
      <div class="spotify-grid">
        <article v-for="playlist in sortedPlaylists" :key="playlist.id" class="spotify-card">
          <div class="album-cover">▤</div>
          <button type="button" class="card-play" @click="playPlaylist(playlist)">▶</button>
          <h3>{{ playlist.titel }}</h3>
          <p>{{ playlist.stimmungsKategorie }} · {{ playlist.songs?.length || playlist.songIds?.length || 0 }} Songs</p>
          <div class="card-meta">
            <span class="badge like-badge">{{ playlist.likes || 0 }} Likes</span>
          </div>
          <div class="card-actions">
            <button type="button" class="ghost-pill" @click="toggleLike(playlist.id)">
              {{ appStore.hasLikedPlaylist(playlist.id) ? 'Liked' : 'Like' }}
            </button>
            <button type="button" class="ghost-pill" @click="playPlaylist(playlist)">Abspielen</button>
            <RouterLink :to="`/playlists/${playlist.id}/edit`" class="text-button">Bearbeiten</RouterLink>
            <button v-if="appStore.isAdmin" type="button" class="text-button" @click="deletePlaylist(playlist.id)">Löschen</button>
          </div>
        </article>
      </div>
    </section>

    <p v-if="!loading && !sortedPlaylists.length" class="empty-state">Noch keine Playlists vorhanden.</p>
  </main>
</template>
