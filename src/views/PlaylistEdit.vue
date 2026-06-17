<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPlaylist, updatePlaylist } from '../services/playlistService.js'
import { getSongs } from '../services/songService.js'
import { moods } from '../store.js'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const songs = ref([])
const playlist = reactive({ titel: '', stimmungsKategorie: 'Fokus', songIds: [] })

onMounted(async () => {
  songs.value = await getSongs()
  const data = await getPlaylist(route.params.id)
  if (data) Object.assign(playlist, { ...data, songIds: data.songIds || data.songs?.map(song => Number(song.id)) || [] })
  loading.value = false
})

function toggleSong(id) {
  const numericId = Number(id)
  if (playlist.songIds.includes(numericId)) playlist.songIds = playlist.songIds.filter(item => item !== numericId)
  else playlist.songIds.push(numericId)
}

async function save() {
  saving.value = true
  errorMessage.value = ''
  try {
    await updatePlaylist(route.params.id, playlist)
    router.push('/playlists')
  } catch (error) {
    errorMessage.value = error.message || 'Playlist konnte nicht gespeichert werden.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Playlist</p>
    <h1 class="page-heading">Playlist bearbeiten</h1>
    <p v-if="loading" class="empty-state">Playlist wird geladen...</p>
    <form v-else class="form-card form-grid" @submit.prevent="save">
      <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>
      <div class="form-row"><label>Name</label><input v-model="playlist.titel"></div>
      <div class="form-row"><label>Stimmung</label><select v-model="playlist.stimmungsKategorie"><option v-for="m in moods" :key="m">{{ m }}</option></select></div>
      <div class="form-row"><label>Songs auswählen</label></div>
      <div class="list-card">
        <div v-for="song in songs" :key="song.id" class="song-row" @click="toggleSong(song.id)">
          <button type="button" class="icon-btn">{{ playlist.songIds.includes(Number(song.id)) ? '✓' : '+' }}</button>
          <div class="song-title"><strong>{{ song.titel }}</strong><span>{{ song.kuenstler }}</span></div>
          <small class="hide-mobile">{{ song.genre }}</small><small class="hide-mobile">{{ song.emotionsKategorie }}</small><small></small><small></small>
        </div>
      </div>
      <div class="page-actions">
        <button class="primary-pill" type="submit" :disabled="saving">{{ saving ? 'Speichert...' : 'Speichern' }}</button>
        <button class="ghost-pill" type="button" @click="router.back()">Zurück</button>
      </div>
    </form>
  </main>
</template>
