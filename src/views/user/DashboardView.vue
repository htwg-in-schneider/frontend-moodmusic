<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { appStore, moods } from '../../store.js'

const router = useRouter()
const selectedMood = ref('Fokus')

function start() {
  appStore.addMoodHistory(selectedMood.value)
  router.push({ path: '/recommendations', query: { mood: selectedMood.value } })
}
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Home</p>
    <h1 class="page-heading">Hallo {{ appStore.displayName }}.</h1>
    <p class="page-lead">Wähle deine Stimmung oder Tätigkeit und starte direkt passende Musik.</p>

    <section class="glass-box">
      <span class="label">Welche Tätigkeit steht an?</span>
      <div class="mood-grid">
        <button
          v-for="mood in moods"
          :key="mood"
          type="button"
          class="mood-chip"
          :class="{ active: selectedMood === mood }"
          @click="selectedMood = mood"
        >
          {{ mood }}
        </button>
      </div>
      <button type="button" class="primary-pill" @click="start">Empfehlungen öffnen →</button>
    </section>

    <section class="dashboard-grid">
      <RouterLink to="/playlists" class="dashboard-tile">
        <h3>Playlists</h3>
        <p>Community-Playlists nach Likes entdecken.</p>
      </RouterLink>
      <RouterLink to="/songs" class="dashboard-tile">
        <h3>Songs</h3>
        <p>Songs suchen, filtern und starten.</p>
      </RouterLink>
      <RouterLink to="/profile" class="dashboard-tile">
        <h3>Mein Profil</h3>
        <p>Name, Adresse und Nutzerdaten bearbeiten.</p>
      </RouterLink>
    </section>

    <section class="spotify-section" v-if="appStore.moodHistory.length">
      <div class="section-title-row">
        <div>
          <h2>Mood Historie</h2>
          <p>Deine letzten Auswahlen.</p>
        </div>
      </div>
      <div class="mood-grid">
        <button v-for="item in appStore.moodHistory.slice(0, 8)" :key="item.id" class="mood-chip" @click="selectedMood = item.mood">
          {{ item.mood }}
        </button>
      </div>
    </section>
  </main>
</template>
