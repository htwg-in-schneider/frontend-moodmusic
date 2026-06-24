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

<style scoped>
.playlist-form {
  max-width: 500px;
}

h1 {
  font-size: 28px;
  margin-bottom: 32px;
}

.error-message {
  color: #F472B6;
  margin-bottom: 20px;
  font-size: 14px;
}

.info-message {
  color: #9CA3AF;
  margin-bottom: 20px;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 13px;
  color: #c084fd;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  background: #140A28;
  border: 1px solid rgba(147, 51, 234, 0.3);
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 14px;
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #9333EA;
}

.form-group select option {
  background: #140A28;
  color: #FFFFFF;
}

.song-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.song-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #140A28;
  border: 1px solid rgba(147, 51, 234, 0.2);
  border-radius: 8px;
  cursor: pointer;
}

.song-option:hover {
  border-color: rgba(147, 51, 234, 0.5);
}

.song-option.selected {
  border-color: #9333EA;
  background: rgba(147, 51, 234, 0.1);
}

.song-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.song-titel {
  font-size: 14px;
  color: #FFFFFF;
}

.song-kuenstler {
  font-size: 12px;
  color: #9CA3AF;
}

.check {
  font-size: 18px;
  color: #9333EA;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(147, 51, 234, 0.1);
}

.song-option.selected .check {
  background: #9333EA;
  color: white;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.btn-save {
  background: #9333EA;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 100px;
  font-size: 14px;
  cursor: pointer;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: transparent;
  color: #9CA3AF;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px 32px;
  border-radius: 100px;
  font-size: 14px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .btn-save,
  .btn-cancel {
    width: 100%;
  }
}
</style>
