<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createPlaylist } from '../services/playlistService.js'
import { getSongs } from '../services/songService.js'
import { moods } from '../store.js'

const router = useRouter()
const errorMessage = ref('')
const loading = ref(false)
const songs = ref([])
const playlist = reactive({ titel: '', stimmungsKategorie: 'Fokus', songIds: [] })

onMounted(async () => {
  songs.value = await getSongs()
})

function toggleSong(id) {
  const numericId = Number(id)
  if (playlist.songIds.includes(numericId)) playlist.songIds = playlist.songIds.filter(item => item !== numericId)
  else playlist.songIds.push(numericId)
}

async function save() {
  if (!playlist.titel || !playlist.stimmungsKategorie || playlist.songIds.length === 0) {
    errorMessage.value = 'Bitte Titel, Stimmung und mindestens einen Song auswählen.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  try {
    await createPlaylist(playlist)
    router.push('/playlists')
  } catch (error) {
    errorMessage.value = error.message || 'Playlist konnte nicht gespeichert werden.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Playlist</p>
    <h1 class="page-heading">Playlist erstellen</h1>
    <form class="form-card form-grid" @submit.prevent="save">
      <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>
      <div class="form-row"><label>Name</label><input v-model="playlist.titel" placeholder="Deep Focus"></div>
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
        <button class="primary-pill" type="submit" :disabled="loading">{{ loading ? 'Speichert...' : 'Speichern' }}</button>
        <button class="ghost-pill" type="button" @click="router.back()">Zurück</button>
      </div>
    </form>
  </main>
</template>
