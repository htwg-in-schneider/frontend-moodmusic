<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSong, updateSong } from '../services/songService.js'
import { moods } from '../store.js'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const selectedFile = ref(null)
const fileInput = ref(null)
const openSelect = ref(false)

const song = reactive({
  titel: '',
  kuenstler: '',
  emotionsKategorie: '',
  dateiName: '',
  audioUrl: ''
})

function setMood(value) {
  song.emotionsKategorie = value
  openSelect.value = false
}

onMounted(async () => {
  const data = await getSong(route.params.id)
  if (data) Object.assign(song, { emotionsKategorie: '', ...data })
  loading.value = false
})

function onFileChange(event) {
  selectedFile.value = event.target.files?.[0] || null
  if (selectedFile.value) song.dateiName = selectedFile.value.name
}

async function save() {
  if (!song.titel || !song.kuenstler || !song.emotionsKategorie) {
    errorMessage.value = 'Bitte Titel, Künstler und Stimmung/Aktivität ausfüllen.'
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

      <div class="form-row"><label>Titel</label><input v-model="song.titel" required></div>
      <div class="form-row"><label>Künstler</label><input v-model="song.kuenstler" required></div>

      <div class="form-row">
        <label>Stimmung / Aktivität</label>
        <div class="custom-select" :class="{ open: openSelect }">
          <button type="button" class="custom-select-trigger" @click="openSelect = !openSelect">
            <span>{{ song.emotionsKategorie || 'Stimmung auswählen' }}</span>
            <span class="custom-select-arrow">⌄</span>
          </button>
          <div v-if="openSelect" class="custom-select-menu">
            <button v-for="mood in moods" :key="mood" type="button" class="custom-select-option" :class="{ selected: song.emotionsKategorie === mood }" @click="setMood(mood)">
              {{ mood }}
            </button>
          </div>
        </div>
      </div>

      <div class="form-row">
        <label>Neue Musikdatei optional</label>
        <input ref="fileInput" class="hidden-file-input" type="file" accept="audio/*" @change="onFileChange">
        <button type="button" class="file-picker" @click="fileInput?.click()">
          <span>Datei auswählen</span>
          <small>{{ selectedFile?.name || song.dateiName || 'Aktuelle Datei bleibt erhalten' }}</small>
        </button>
      </div>

      <div class="page-actions">
        <button class="primary-pill" type="submit" :disabled="saving">{{ saving ? 'Speichert...' : 'Speichern' }}</button>
        <button class="ghost-pill" type="button" @click="router.back()">Zurück</button>
      </div>
    </form>
  </main>
</template>
