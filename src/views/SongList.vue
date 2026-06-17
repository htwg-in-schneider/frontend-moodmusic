<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { appStore, genres, moods } from '../store.js'
import { getSongs, deleteSong as deleteSongApi } from '../services/songService.js'

const suche = ref('')
const genre = ref('')
const mood = ref('')
const songs = ref([])
const loading = ref(false)
const errorMessage = ref('')
const openFilter = ref(null)

const filteredSongs = computed(() => songs.value)

function toggleFilter(name) {
  openFilter.value = openFilter.value === name ? null : name
}

function setGenre(value) {
  genre.value = value
  openFilter.value = null
}

function setMood(value) {
  mood.value = value
  openFilter.value = null
}

async function loadSongs() {
  loading.value = true
  errorMessage.value = ''
  try {
    songs.value = await getSongs(suche.value, genre.value, mood.value)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Songs konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

async function deleteSong(id) {
  await deleteSongApi(id)
  await loadSongs()
}

function playSong(song) {
  appStore.playSong(song, filteredSongs.value)
}

onMounted(loadSongs)
watch([suche, genre, mood], loadSongs)
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Library</p>
    <h1 class="page-heading">Songs</h1>
    <p class="page-lead">Deine Musikbibliothek. Songs nach Genre und Stimmung/Aktivität filtern.</p>

    <section class="filter-panel filter-panel-songs filter-panel-songs-wide">
      <input v-model="suche" placeholder="Titel oder Künstler suchen...">

      <div class="custom-select" :class="{ open: openFilter === 'genre' }">
        <button type="button" class="custom-select-trigger" @click="toggleFilter('genre')">
          <span>{{ genre || 'Alle Genres' }}</span>
          <span class="custom-select-arrow">⌄</span>
        </button>
        <div v-if="openFilter === 'genre'" class="custom-select-menu">
          <button type="button" class="custom-select-option" :class="{ selected: genre === '' }" @click="setGenre('')">Alle Genres</button>
          <button
            v-for="item in genres"
            :key="item"
            type="button"
            class="custom-select-option"
            :class="{ selected: genre === item }"
            @click="setGenre(item)"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <div class="custom-select" :class="{ open: openFilter === 'mood' }">
        <button type="button" class="custom-select-trigger" @click="toggleFilter('mood')">
          <span>{{ mood || 'Alle Stimmungen' }}</span>
          <span class="custom-select-arrow">⌄</span>
        </button>
        <div v-if="openFilter === 'mood'" class="custom-select-menu">
          <button type="button" class="custom-select-option" :class="{ selected: mood === '' }" @click="setMood('')">Alle Stimmungen</button>
          <button
            v-for="item in moods"
            :key="item"
            type="button"
            class="custom-select-option"
            :class="{ selected: mood === item }"
            @click="setMood(item)"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <RouterLink v-if="appStore.isAdmin" to="/songs/create" class="primary-pill">Neuer Song</RouterLink>
    </section>

    <p v-if="loading" class="empty-state">Songs werden geladen...</p>
    <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>

    <section v-if="!loading && filteredSongs.length" class="list-card">
      <div v-for="song in filteredSongs" :key="song.id" class="song-row song-row-simple">
        <button type="button" class="icon-btn" @click="playSong(song)">▶</button>

        <div class="song-title">
          <strong>{{ song.titel }}</strong>
          <span>{{ song.kuenstler }}</span>
        </div>

        <small class="hide-mobile">{{ song.genre }} · {{ song.emotionsKategorie || 'Neutral' }}</small>

        <div class="song-actions">
          <RouterLink v-if="appStore.isAdmin" :to="`/songs/${song.id}/edit`" class="icon-btn">✎</RouterLink>
          <button v-if="appStore.isAdmin" type="button" class="icon-btn" @click="deleteSong(song.id)">×</button>
        </div>
      </div>
    </section>

    <p v-if="!loading && !filteredSongs.length" class="empty-state">Keine Songs gefunden.</p>
  </main>
</template>
