<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSong, updateSong } from '../services/songService.js'
import { genres, moods } from '../store.js'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const selectedFile = ref(null)
const openSelect = ref(null)

const song = reactive({
  titel: '',
  kuenstler: '',
  genre: 'Lo-Fi',
  emotionsKategorie: 'Fokus',
  dateiName: '',
  audioUrl: ''
})

function toggleSelect(name) {
  openSelect.value = openSelect.value === name ? null : name
}

function setGenre(value) {
  song.genre = value
  openSelect.value = null
}

function setMood(value) {
  song.emotionsKategorie = value
  openSelect.value = null
}

onMounted(async () => {
  const data = await getSong(route.params.id)
  if (data) Object.assign(song, { emotionsKategorie: 'Fokus', ...data })
  loading.value = false
})

function onFileChange(event) {
  selectedFile.value = event.target.files?.[0] || null
  if (selectedFile.value) song.dateiName = selectedFile.value.name
}

async function save() {
  if (!song.titel || !song.kuenstler || !song.genre || !song.emotionsKategorie) {
    errorMessage.value = 'Bitte Titel, Künstler, Genre und Stimmung/Aktivität ausfüllen.'
    return
  }

  saving.value = true
  errorMessage.value = ''
  try {
    await updateSong(route.params.id, { ...song, file: selectedFile.value })
    router.push('/songs')
  } catch (error) {
    errorMessage.value = error.message || 'Song konnte nicht aktualisiert werden.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Admin</p>
    <h1 class="page-heading">Song bearbeiten</h1>

    <p v-if="loading" class="empty-state">Song wird geladen...</p>

    <form v-else class="form-card form-grid" @submit.prevent="save">
      <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>

      <div class="form-row">
        <label>Titel</label>
        <input v-model="song.titel" required>
      </div>

      <div class="form-row">
        <label>Künstler</label>
        <input v-model="song.kuenstler" required>
      </div>

      <div class="form-row">
        <label>Genre</label>
        <div class="custom-select" :class="{ open: openSelect === 'genre' }">
          <button type="button" class="custom-select-trigger" @click="toggleSelect('genre')">
            <span>{{ song.genre }}</span>
            <span class="custom-select-arrow">⌄</span>
          </button>
          <div v-if="openSelect === 'genre'" class="custom-select-menu">
            <button
              v-for="g in genres"
              :key="g"
              type="button"
              class="custom-select-option"
              :class="{ selected: song.genre === g }"
              @click="setGenre(g)"
            >
              {{ g }}
            </button>
          </div>
        </div>
      </div>

      <div class="form-row">
        <label>Stimmung / Aktivität</label>
        <div class="custom-select" :class="{ open: openSelect === 'mood' }">
          <button type="button" class="custom-select-trigger" @click="toggleSelect('mood')">
            <span>{{ song.emotionsKategorie }}</span>
            <span class="custom-select-arrow">⌄</span>
          </button>
          <div v-if="openSelect === 'mood'" class="custom-select-menu">
            <button
              v-for="mood in moods"
              :key="mood"
              type="button"
              class="custom-select-option"
              :class="{ selected: song.emotionsKategorie === mood }"
              @click="setMood(mood)"
            >
              {{ mood }}
            </button>
          </div>
        </div>
      </div>

      <div class="form-row">
        <label>Neue Musikdatei optional</label>
        <input type="file" accept="audio/*" @change="onFileChange">
        <small v-if="song.dateiName" class="form-help">Aktuelle Datei: {{ song.dateiName }}</small>
      </div>

      <div class="page-actions">
        <button class="primary-pill" type="submit" :disabled="saving">
          {{ saving ? 'Speichert...' : 'Speichern' }}
        </button>
        <button class="ghost-pill" type="button" @click="router.back()">Zurück</button>
      </div>
    </form>
  </main>
</template>
