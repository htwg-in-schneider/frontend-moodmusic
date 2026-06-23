<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPlaylist, updatePlaylist } from '../services/playlistService.js'
import { getSongs } from '../services/songService.js'
import { moods } from '../store.js'
import { resolveImageUrl } from '../services/api.js'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const songs = ref([])
const coverPreview = ref('')
const coverInput = ref(null)
const openSelect = ref(false)

const playlist = reactive({
  titel: '',
  stimmungsKategorie: '',
  description: '',
  songIds: [],
  coverFile: null,
  coverImageUrl: ''
})

const filteredSongs = computed(() => {
  if (!playlist.stimmungsKategorie) return []
  return songs.value.filter(song => song.emotionsKategorie === playlist.stimmungsKategorie)
})

onMounted(async () => {
  songs.value = await getSongs()
  const data = await getPlaylist(route.params.id)
  if (data) {
    Object.assign(playlist, {
      ...data,
      stimmungsKategorie: data.stimmungsKategorie || '',
      songIds: data.songIds || data.songs?.map(song => Number(song.id)) || [],
      coverFile: null
    })
    coverPreview.value = data.coverImageUrl ? resolveImageUrl(data.coverImageUrl) : ''
  }
  loading.value = false
})

watch(() => playlist.stimmungsKategorie, () => {
  playlist.songIds = playlist.songIds.filter(id => filteredSongs.value.some(song => Number(song.id) === Number(id)))
})

function setMood(value) {
  playlist.stimmungsKategorie = value
  openSelect.value = false
}

function toggleSong(id) {
  const numericId = Number(id)
  if (playlist.songIds.includes(numericId)) playlist.songIds = playlist.songIds.filter(item => item !== numericId)
  else playlist.songIds.push(numericId)
}

function onCoverChange(event) {
  const file = event.target.files?.[0] || null
  playlist.coverFile = file
  coverPreview.value = file ? URL.createObjectURL(file) : (playlist.coverImageUrl ? resolveImageUrl(playlist.coverImageUrl) : '')
}

async function save() {
  saving.value = true
  errorMessage.value = ''
  try {
    await updatePlaylist(route.params.id, playlist)
    router.push(`/playlists/${route.params.id}`)
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

      <div class="playlist-form-top">
        <div class="playlist-cover-preview">
          <img v-if="coverPreview" :src="coverPreview" alt="Cover Vorschau">
          <span v-else>▤</span>
        </div>
        <div class="form-grid">
          <div class="form-row">
            <label>Coverbild optional</label>
            <input ref="coverInput" class="hidden-file-input" type="file" accept="image/*" @change="onCoverChange">
            <button type="button" class="file-picker" @click="coverInput?.click()">
              <span>Bild auswählen</span>
              <small>{{ playlist.coverFile?.name || (playlist.coverImageUrl ? 'Aktuelles Bild bleibt erhalten' : 'Standard-Cover aktiv') }}</small>
            </button>
          </div>
          <div class="form-row"><label>Titel</label><input v-model="playlist.titel"></div>
        </div>
      </div>

      <div class="form-row">
        <label>Stimmung / Aktivität</label>
        <div class="custom-select" :class="{ open: openSelect }">
          <button type="button" class="custom-select-trigger" @click="openSelect = !openSelect">
            <span>{{ playlist.stimmungsKategorie || 'Stimmung auswählen' }}</span>
            <span class="custom-select-arrow">⌄</span>
          </button>
          <div v-if="openSelect" class="custom-select-menu">
            <button v-for="mood in moods" :key="mood" type="button" class="custom-select-option" :class="{ selected: playlist.stimmungsKategorie === mood }" @click="setMood(mood)">
              {{ mood }}
            </button>
          </div>
        </div>
      </div>
      <div class="form-row"><label>Beschreibung</label><textarea v-model="playlist.description"></textarea></div>

      <div class="form-row"><label>Songs passend zur Stimmung</label></div>
      <p v-if="!filteredSongs.length" class="empty-state">Für diese Stimmung gibt es noch keine Songs.</p>
      <div v-else class="list-card">
        <div v-for="song in filteredSongs" :key="song.id" class="song-row song-row-simple song-row-mood-only" @click="toggleSong(song.id)">
          <button type="button" class="icon-btn">{{ playlist.songIds.includes(Number(song.id)) ? '✓' : '+' }}</button>
          <div class="song-title"><strong>{{ song.titel }}</strong><span>{{ song.kuenstler }}</span></div>
          <small class="hide-mobile">{{ song.emotionsKategorie }}</small>
          <small></small>
        </div>
      </div>

      <div class="page-actions">
        <button class="primary-pill" type="submit" :disabled="saving">{{ saving ? 'Speichert...' : 'Speichern' }}</button>
        <button class="ghost-pill" type="button" @click="router.back()">Zurück</button>
      </div>
    </form>
  </main>
</template>
