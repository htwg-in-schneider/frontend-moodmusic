<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { appStore } from '../store.js'
import { getPlaylists, deletePlaylist as deletePlaylistApi, likePlaylist } from '../services/playlistService.js'
import { resolveImageUrl } from '../services/api.js'

const playlists = ref([])
const tab = ref('mine')
const search = ref('')
const loading = ref(false)
const errorMessage = ref('')

const visiblePlaylists = computed(() => playlists.value)

async function loadData() {
  loading.value = true
  errorMessage.value = ''
  try {
    playlists.value = await getPlaylists(tab.value, { q: search.value })
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Playlists konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

async function changeTab(value) {
  tab.value = value
  await loadData()
}

async function deletePlaylist(id) {
  await deletePlaylistApi(id)
  await loadData()
}

async function toggleLike(id) {
  await likePlaylist(id)
  await loadData()
}

function playPlaylist(playlist) {
  appStore.playPlaylist(playlist, playlist.stimmungsKategorie)
}

function canEdit(playlist) {
  return appStore.isAdmin || Number(playlist.creatorId) === Number(appStore.user?.id)
}

onMounted(loadData)
watch(search, loadData)
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Deine Sammlung</p>
    <h1 class="page-heading">Playlists</h1>
    <p class="page-lead">Hier findest du nur Playlists, die du selbst erstellt oder bewusst gelikt hast.</p>

    <section class="filter-panel playlist-library-panel">
      <input v-model="search" placeholder="Playlist nach Titel suchen...">

      <div class="playlist-tabs-inline">
        <button class="ghost-pill" :class="{ active: tab === 'mine' }" @click="changeTab('mine')">Selbst erstellt</button>
        <button class="ghost-pill" :class="{ active: tab === 'liked' }" @click="changeTab('liked')">Gelikt</button>
      </div>

      <RouterLink to="/playlists/create" class="primary-pill">Playlist erstellen</RouterLink>
    </section>

    <p v-if="loading" class="empty-state">Playlists werden geladen...</p>
    <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>

    <section v-if="!loading && visiblePlaylists.length" class="spotify-section">
      <div class="spotify-grid">
        <article v-for="playlist in visiblePlaylists" :key="playlist.id" class="spotify-card">
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
            <button type="button" class="ghost-pill" @click="toggleLike(playlist.id)">{{ playlist.likedByCurrentUser ? 'Liked' : 'Like' }}</button>
            <button type="button" class="ghost-pill" @click="playPlaylist(playlist)">Abspielen</button>
            <RouterLink v-if="canEdit(playlist)" :to="`/playlists/${playlist.id}/edit`" class="text-button">Bearbeiten</RouterLink>
            <button v-if="canEdit(playlist)" type="button" class="text-button" @click="deletePlaylist(playlist.id)">Löschen</button>
          </div>
        </article>
      </div>
    </section>

    <p v-if="!loading && !visiblePlaylists.length" class="empty-state">
      {{ search ? 'Keine Playlist mit diesem Titel gefunden.' : tab === 'mine' ? 'Du hast noch keine Playlist erstellt.' : 'Du hast noch keine Playlist gelikt.' }}
    </p>
  </main>
</template>
