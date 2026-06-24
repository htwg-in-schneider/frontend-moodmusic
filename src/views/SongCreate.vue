<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createSong } from '../services/songService.js'
import { moods } from '../store.js'

const router = useRouter()
const errorMessage = ref('')
const selectedFile = ref(null)
const fileInput = ref(null)
const loading = ref(false)
const openSelect = ref(false)

const song = reactive({
  titel: '',
  kuenstler: '',
  emotionsKategorie: '',
  dateiName: ''
})

function setMood(value) {
  song.emotionsKategorie = value
  openSelect.value = false
}

function onFileChange(event) {
  selectedFile.value = event.target.files?.[0] || null
  if (selectedFile.value) song.dateiName = selectedFile.value.name
}

async function save() {
  if (!song.titel || !song.kuenstler || !song.emotionsKategorie) {
    errorMessage.value = 'Bitte Titel, Künstler und Stimmung/Aktivität ausfüllen.'
    return
  }
  if (!selectedFile.value) {
    errorMessage.value = 'Bitte eine Musikdatei hochladen.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  try {
    await createSong({ ...song, file: selectedFile.value })
    router.push('/songs')
  } catch (error) {
    errorMessage.value = error.message || 'Song konnte nicht gespeichert werden.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Admin</p>
    <h1 class="page-heading">Song hochladen</h1>
    <p class="page-lead">Füge Titel, Künstler, Stimmung und eine Audiodatei hinzu.</p>

    <form class="form-card form-grid" @submit.prevent="save">
      <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>

      <div class="form-row"><label>Titel</label><input v-model="song.titel" placeholder="z. B. Calm Study Chill Hop" required></div>
      <div class="form-row"><label>Künstler</label><input v-model="song.kuenstler" placeholder="z. B. FASSounds" required></div>

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
        <label>Musikdatei</label>
        <input ref="fileInput" class="hidden-file-input" type="file" accept="audio/*" required @change="onFileChange">
        <button type="button" class="file-picker" @click="fileInput?.click()">
          <span>Datei auswählen</span>
          <small>{{ song.dateiName || 'Keine Datei ausgewählt' }}</small>
        </button>
      </div>

      <div class="page-actions">
        <button class="primary-pill" type="submit" :disabled="loading">{{ loading ? 'Lädt hoch...' : 'Speichern' }}</button>
        <button class="ghost-pill" type="button" @click="router.back()">Zurück</button>
      </div>
    </form>
  </main>
</template>
