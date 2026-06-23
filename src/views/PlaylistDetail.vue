<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { appStore } from '../store.js'
import { getPlaylist, likePlaylist } from '../services/playlistService.js'
import { resolveImageUrl } from '../services/api.js'

const route = useRoute()
const router = useRouter()
const playlist = ref(null)
const loading = ref(false)
const errorMessage = ref('')

async function loadPlaylist() {
  loading.value = true
  errorMessage.value = ''
  try {
    playlist.value = await getPlaylist(route.params.id)
  } catch (error) {
    errorMessage.value = error.message || 'Playlist konnte nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

function playAll() {
  if (!playlist.value) return
  appStore.playPlaylist(playlist.value, playlist.value.stimmungsKategorie)
}

function playSong(song) {
  appStore.playSong(song, playlist.value?.songs || [song], playlist.value?.stimmungsKategorie)
}

async function toggleLike() {
  await likePlaylist(route.params.id)
  await loadPlaylist()
}

function canEdit() {
  return appStore.isAdmin || Number(playlist.value?.creatorId) === Number(appStore.user?.id)
}

onMounted(loadPlaylist)
</script>

<template>
  <main class="app-page">
    <button class="ghost-pill" type="button" @click="router.back()">Zurück</button>

    <p v-if="loading" class="empty-state">Playlist wird geladen...</p>
    <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>

    <section v-if="playlist" class="playlist-detail-hero">
      <div class="playlist-detail-cover">
        <img v-if="playlist.coverImageUrl" :src="resolveImageUrl(playlist.coverImageUrl)" alt="Playlist Cover">
        <span v-else>▤</span>
      </div>

      <div>
        <p class="page-kicker">Playlist</p>
        <h1 class="page-heading">{{ playlist.titel }}</h1>
        <p class="page-lead">{{ playlist.description || 'Keine Beschreibung vorhanden.' }}</p>
        <div class="creator-row">
          <span class="creator-avatar">
            <img v-if="playlist.creatorImageUrl" :src="resolveImageUrl(playlist.creatorImageUrl)" alt="Profilbild">
            <b v-else>{{ (playlist.creatorName || 'U').charAt(0).toUpperCase() }}</b>
          </span>
          <span>von {{ playlist.creatorName || 'Unbekannt' }}</span>
          <span>· {{ playlist.stimmungsKategorie }}</span>
          <span>· {{ playlist.likes || 0 }} Likes</span>
        </div>

        <div class="page-actions">
          <button class="primary-pill" type="button" :disabled="!playlist.songs?.length" @click="playAll">Playlist abspielen</button>
          <button class="ghost-pill" type="button" @click="toggleLike">{{ playlist.likedByCurrentUser ? 'Unlike' : 'Like' }}</button>
          <RouterLink v-if="canEdit()" :to="`/playlists/${playlist.id}/edit`" class="ghost-pill">Bearbeiten</RouterLink>
        </div>
      </div>
    </section>

    <section v-if="playlist" class="spotify-section">
      <div class="section-title-row">
        <div>
          <h2>Songs</h2>
          <p>{{ playlist.songs?.length || 0 }} Songs in dieser Playlist</p>
        </div>
      </div>

      <p v-if="!playlist.songs?.length" class="empty-state">Diese Playlist enthält noch keine Songs.</p>

      <div v-else class="list-card">
        <div v-for="song in playlist.songs" :key="song.id" class="song-row song-row-simple song-row-mood-only">
          <button type="button" class="icon-btn" @click="playSong(song)">▶</button>
          <div class="song-title"><strong>{{ song.titel }}</strong><span>{{ song.kuenstler }}</span></div>
          <small class="hide-mobile">{{ song.emotionsKategorie }}</small>
          <small></small>
        </div>
      </div>
    </section>
  </main>
</template>
