<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getSongs } from '../services/songService.js'
import { getPlaylist, updatePlaylist as updatePlaylistApi } from '../services/playlistService.js'

const router = useRouter()
const route = useRoute()

const playlist = ref({
  titel: '',
  stimmungsKategorie: '',
  songIds: []
})

const songs = ref([])
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')

const kategorien = ['Glücklich', 'Traurig', 'Energiegeladen', 'Entspannt', 'Fokus', 'Neutral']

onMounted(async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const loadedPlaylist = await getPlaylist(route.params.id)
    const loadedSongs = await getSongs()

    songs.value = loadedSongs

    playlist.value = {
      titel: loadedPlaylist.titel,
      stimmungsKategorie: loadedPlaylist.stimmungsKategorie,
      songIds: loadedPlaylist.songs ? loadedPlaylist.songs.map(song => song.id) : []
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Playlist konnte nicht geladen werden.'
  } finally {
    loading.value = false
  }
})

function toggleSong(songId) {
  const index = playlist.value.songIds.indexOf(songId)

  if (index === -1) {
    playlist.value.songIds.push(songId)
  } else {
    playlist.value.songIds.splice(index, 1)
  }
}

function isSongSelected(songId) {
  return playlist.value.songIds.includes(songId)
}

async function updatePlaylist() {
  errorMessage.value = ''
  saving.value = true

  try {
    await updatePlaylistApi(route.params.id, playlist.value)
    router.push('/playlists')
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Playlist konnte nicht aktualisiert werden.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="playlist-form">
    <h1>Playlist bearbeiten</h1>

    <p v-if="loading" class="info-message">
      Playlist wird geladen...
    </p>

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <template v-if="!loading">
      <div class="form-group">
        <label>Playlist Name</label>
        <input
          v-model="playlist.titel"
          type="text"
          placeholder="z.B. Workout Energy"
        >
      </div>

      <div class="form-group">
        <label>Stimmungskategorie</label>
        <select v-model="playlist.stimmungsKategorie">
          <option value="" disabled>Kategorie wählen</option>
          <option v-for="k in kategorien" :key="k" :value="k">
            {{ k }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Songs auswählen ({{ playlist.songIds.length }} ausgewählt)</label>

        <div class="song-picker">
          <div
            v-for="song in songs"
            :key="song.id"
            class="song-option"
            :class="{ selected: isSongSelected(song.id) }"
            @click="toggleSong(song.id)"
          >
            <div class="song-info">
              <span class="song-titel">{{ song.titel }}</span>
              <span class="song-kuenstler">{{ song.kuenstler }}</span>
            </div>

            <span class="check">
              {{ isSongSelected(song.id) ? '✓' : '+' }}
            </span>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button @click="updatePlaylist" class="btn-save" :disabled="saving">
          {{ saving ? 'Speichert...' : 'Änderungen speichern' }}
        </button>

        <button @click="router.push('/playlists')" class="btn-cancel">
          Abbrechen
        </button>
      </div>
    </template>
  </div>
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
  color: #C084FC;
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