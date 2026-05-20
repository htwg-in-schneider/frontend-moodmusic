<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createSong } from '../services/songService.js'

const router = useRouter()

const song = ref({
  titel: '',
  kuenstler: '',
  genre: '',
  bpm: 120,
  emotionsKategorie: '',
  dateiName: ''
})

const audioDatei = ref(null)
const errorMessage = ref('')
const saving = ref(false)

const genres = ['Pop', 'Hip-Hop', 'Electronic', 'Klassik', 'Rock', 'Jazz', 'Lo-Fi', 'R&B']
const emotionen = ['Glücklich', 'Traurig', 'Energiegeladen', 'Entspannt', 'Fokus', 'Neutral']

function onFileSelect(event) {
  const file = event.target.files[0]

  if (file) {
    audioDatei.value = file
    song.value.dateiName = file.name
  }
}

async function saveSong() {
  errorMessage.value = ''
  saving.value = true

  try {
    await createSong(song.value)
    router.push('/')
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Song konnte nicht gespeichert werden.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="song-form">
    <h1>Neuer Song</h1>

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <div class="form-group">
      <label>Titel</label>
      <input v-model="song.titel" type="text" placeholder="z.B. Blinding Lights">
    </div>

    <div class="form-group">
      <label>Künstler</label>
      <input v-model="song.kuenstler" type="text" placeholder="z.B. The Weeknd">
    </div>

    <div class="form-group">
      <label>Genre</label>
      <select v-model="song.genre">
        <option value="" disabled>Genre wählen</option>
        <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
      </select>
    </div>

    <div class="form-group">
      <label>BPM</label>
      <input v-model.number="song.bpm" type="number" min="40" max="220">
    </div>

    <div class="form-group">
      <label>Audio-Datei (MP3)</label>
      <div class="file-upload">
        <input
          type="file"
          accept=".mp3,audio/mpeg"
          @change="onFileSelect"
          id="audio-input"
        >
        <label for="audio-input" class="file-label">
          {{ song.dateiName || 'MP3-Datei auswählen...' }}
        </label>
      </div>
    </div>

    <div class="form-group">
      <label>Emotions-Kategorie</label>
      <select v-model="song.emotionsKategorie">
        <option value="" disabled>Emotion wählen</option>
        <option v-for="e in emotionen" :key="e" :value="e">{{ e }}</option>
      </select>
    </div>

    <div class="form-actions">
      <button @click="saveSong" class="btn-save" :disabled="saving">
        {{ saving ? 'Speichert...' : 'Speichern' }}
      </button>

      <button @click="router.push('/')" class="btn-cancel">
        Abbrechen
      </button>
    </div>
  </div>
</template>

<style scoped>
.song-form {
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

.file-upload {
  position: relative;
}

.file-upload input[type="file"] {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-label {
  display: block;
  width: 100%;
  padding: 12px 16px;
  background: #140A28;
  border: 1px dashed rgba(147, 51, 234, 0.3);
  border-radius: 8px;
  color: #9CA3AF;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
}

.file-upload:hover .file-label {
  border-color: #9333EA;
  color: #C084FC;
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