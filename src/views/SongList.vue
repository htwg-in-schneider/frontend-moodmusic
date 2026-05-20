<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { getSongs, deleteSong as deleteSongApi } from '../services/songService.js'

const suchbegriff = ref('')
const filterGenre = ref('')
const filterEmotion = ref('')

const songs = ref([])
const gesamtAnzahl = ref(0)
const loading = ref(false)
const errorMessage = ref('')

const genres = ['', 'Pop', 'Hip-Hop', 'Electronic', 'Klassik', 'Rock', 'Jazz', 'Lo-Fi', 'R&B']
const emotionen = ['', 'Glücklich', 'Traurig', 'Energiegeladen', 'Entspannt', 'Fokus', 'Neutral']

async function loadSongs() {
  loading.value = true
  errorMessage.value = ''

  try {
    songs.value = await getSongs(
      suchbegriff.value,
      filterGenre.value,
      filterEmotion.value
    )
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Songs konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

async function loadGesamtAnzahl() {
  const alleSongs = await getSongs()
  gesamtAnzahl.value = alleSongs.length
}

function resetFilter() {
  suchbegriff.value = ''
  filterGenre.value = ''
  filterEmotion.value = ''
}

async function deleteSong(id) {
  await deleteSongApi(id)
  await loadSongs()
  await loadGesamtAnzahl()
}

onMounted(async () => {
  await loadSongs()
  await loadGesamtAnzahl()
})

watch([suchbegriff, filterGenre, filterEmotion], () => {
  loadSongs()
})
</script>

<template>
  <div class="song-list">
    <div class="header">
      <h1>Alle Songs</h1>
      <RouterLink to="/songs/create" class="btn-create">+ Neuer Song</RouterLink>
    </div>

    <div class="filter-bar">
      <input 
        v-model="suchbegriff" 
        type="text" 
        placeholder="Suche nach Titel oder Künstler..."
        class="search-input"
      >

      <select v-model="filterGenre" class="filter-select">
        <option value="">Alle Genres</option>
        <option v-for="g in genres.slice(1)" :key="g" :value="g">
          {{ g }}
        </option>
      </select>

      <select v-model="filterEmotion" class="filter-select">
        <option value="">Alle Emotionen</option>
        <option v-for="e in emotionen.slice(1)" :key="e" :value="e">
          {{ e }}
        </option>
      </select>

      <button 
        v-if="suchbegriff || filterGenre || filterEmotion" 
        @click="resetFilter" 
        class="btn-reset"
      >
        Filter zurücksetzen
      </button>
    </div>

    <p class="result-count">{{ songs.length }} von {{ gesamtAnzahl }} Songs</p>

    <p v-if="loading" class="no-results">Songs werden geladen...</p>
    <p v-if="errorMessage" class="no-results">{{ errorMessage }}</p>

    <table v-if="!loading && songs.length > 0" class="song-table">
      <thead>
        <tr>
          <th>Titel</th>
          <th>Künstler</th>
          <th>Genre</th>
          <th>BPM</th>
          <th>Emotion</th>
          <th>Datei</th>
          <th>Aktionen</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="song in songs" :key="song.id">
          <td>{{ song.titel }}</td>
          <td>{{ song.kuenstler }}</td>
          <td>{{ song.genre }}</td>
          <td>{{ song.bpm }}</td>
          <td>{{ song.emotionsKategorie }}</td>
          <td>{{ song.dateiName }}</td>
          <td class="actions">
            <RouterLink :to="'/songs/' + song.id + '/edit'" class="btn-edit">
              Bearbeiten
            </RouterLink>
            <button @click="deleteSong(song.id)" class="btn-delete">
              Löschen
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!loading && songs.length === 0" class="no-results">
      Keine Songs gefunden.
    </p>
  </div>
</template>