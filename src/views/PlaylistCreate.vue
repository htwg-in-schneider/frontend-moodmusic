<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { createPlaylist } from '../services/playlistService.js'
import { getSongs } from '../services/songService.js'
import { moods } from '../store.js'

const router = useRouter()
const errorMessage = ref('')
const loading = ref(false)
const songs = ref([])
const coverPreview = ref('')
const coverInput = ref(null)
const openSelect = ref(false)

const playlist = reactive({
  titel: '',
  stimmungsKategorie: '',
  description: '',
  songIds: [],
  coverFile: null
})

const filteredSongs = computed(() => {
  if (!playlist.stimmungsKategorie) return []
  return songs.value.filter(song => song.emotionsKategorie === playlist.stimmungsKategorie)
})

onMounted(async () => {
  songs.value = await getSongs()
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
  coverPreview.value = file ? URL.createObjectURL(file) : ''
}

async function save() {
  if (!playlist.titel || !playlist.stimmungsKategorie) {
    errorMessage.value = 'Bitte Titel und Stimmung/Aktivität ausfüllen.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  try {
    const created = await createPlaylist(playlist)
    router.push(`/playlists/${created.id}`)
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
    <p class="page-lead">Wähle eine Stimmung. Danach kannst du passende Songs hinzufügen.</p>

    <form class="form-card form-grid" @submit.prevent="save">
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
              <small>{{ playlist.coverFile?.name || 'Standard-Cover aktiv' }}</small>
            </button>
          </div>
          <div class="form-row"><label>Titel</label><input v-model="playlist.titel" placeholder="z. B. Deep Focus Session"></div>
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

      <div class="form-row"><label>Beschreibung optional</label><textarea v-model="playlist.description" placeholder="Wofür ist diese Playlist gedacht?"></textarea></div>

      <div class="form-row">
        <label>Songs auswählen</label>
        <p class="form-help">Es erscheinen nur Songs für {{ playlist.stimmungsKategorie || 'die gewählte Stimmung' }}.</p>
      </div>

      <p v-if="playlist.stimmungsKategorie && !filteredSongs.length" class="empty-state">Für diese Stimmung gibt es noch keine Songs.</p>
      <p v-if="!playlist.stimmungsKategorie" class="empty-state">Wähle zuerst eine Stimmung aus.</p>

      <div v-if="filteredSongs.length" class="list-card">
        <div v-for="song in filteredSongs" :key="song.id" class="song-row song-row-simple song-row-mood-only" @click="toggleSong(song.id)">
          <button type="button" class="icon-btn">{{ playlist.songIds.includes(Number(song.id)) ? '✓' : '+' }}</button>
          <div class="song-title"><strong>{{ song.titel }}</strong><span>{{ song.kuenstler }}</span></div>
          <small class="hide-mobile">{{ song.emotionsKategorie }}</small>
          <small></small>
        </div>
      </div>

      <div class="page-actions">
        <button class="primary-pill" type="submit" :disabled="loading">{{ loading ? 'Speichert...' : 'Speichern' }}</button>
        <button class="ghost-pill" type="button" @click="router.back()">Zurück</button>
      </div>
    </form>
  </main>
</template>
