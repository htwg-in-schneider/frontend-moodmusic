<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { appStore, moods } from '../../store.js'
import { getDailyHistory, getHistoryDay } from '../../services/historyService.js'

const router = useRouter()
const selectedMood = ref('')
const loadingHistory = ref(false)
const loadingDetails = ref(false)
const selectedDay = ref(null)
const dayDetails = ref([])

const maxTotal = computed(() => Math.max(1, ...appStore.dailyHistory.map(day => Number(day.total || 0))))
const totalListens = computed(() => appStore.dailyHistory.reduce((sum, day) => sum + Number(day.total || 0), 0))
const activeDays = computed(() => appStore.dailyHistory.filter(day => Number(day.total || 0) > 0).length)

function start() {
  if (!selectedMood.value) return
  appStore.setCurrentMood(selectedMood.value)
  appStore.addMoodHistory(selectedMood.value)
  router.push({ path: '/songs', query: { mood: selectedMood.value } })
}

async function loadHistory() {
  loadingHistory.value = true
  try {
    appStore.setDailyHistory(await getDailyHistory(14))
  } catch (error) {
    console.warn('Mood-Historie konnte nicht geladen werden.', error)
  } finally {
    loadingHistory.value = false
  }
}

async function openDay(day) {
  selectedDay.value = day
  dayDetails.value = []
  loadingDetails.value = true
  try {
    dayDetails.value = await getHistoryDay(day.date)
  } catch (error) {
    console.warn('Tagesdetails konnten nicht geladen werden.', error)
  } finally {
    loadingDetails.value = false
  }
}

function closeDay() {
  selectedDay.value = null
  dayDetails.value = []
}

function formatDay(date) {
  return new Date(date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

function formatLongDay(date) {
  return new Date(date).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

function topEntries(map, limit = 3) {
  return Object.entries(map || {}).sort((a, b) => b[1] - a[1]).slice(0, limit)
}

function percent(count, total) {
  if (!total) return 0
  return Math.round((Number(count) / Number(total)) * 100)
}

onMounted(loadHistory)
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Home</p>
    <h1 class="page-heading">Hallo {{ appStore.displayName }}.</h1>
    <p class="page-lead">Reflektiere kurz, wie du dich fühlst oder was gerade ansteht. Danach öffnet sich deine passende Song-Auswahl.</p>

    <section class="glass-box mood-start-box">
      <span class="label">Welche Tätigkeit steht an?</span>
      <p class="mood-helper">Wähle erst eine Stimmung oder Aktivität aus. Anfangs ist bewusst nichts ausgewählt.</p>

      <div class="mood-grid">
        <button v-for="mood in moods" :key="mood" type="button" class="mood-chip" :class="{ active: selectedMood === mood }" @click="selectedMood = mood">
          {{ mood }}
        </button>
      </div>

      <div class="center-action">
        <button type="button" class="primary-pill listen-button" :disabled="!selectedMood" @click="start">Reinhören →</button>
      </div>
    </section>

    <section class="dashboard-grid">
      <RouterLink to="/playlists" class="dashboard-tile"><h3>Playlists</h3><p>Eigene und gelikte Playlists entdecken.</p></RouterLink>
      <RouterLink to="/songs" class="dashboard-tile"><h3>Songs</h3><p>Songs suchen, filtern und direkt starten.</p></RouterLink>
      <RouterLink to="/profile" class="dashboard-tile"><h3>Mein Profil</h3><p>Profilbild, Name und Passwort ändern.</p></RouterLink>
    </section>

    <section class="spotify-section">
      <div class="section-title-row">
        <div>
          <h2>Mood Historie</h2>
          <p>Klick auf einen Tag, um genauer zu sehen, welche Songs und Stimmungen du gehört hast.</p>
        </div>
      </div>

      <div class="history-summary-grid">
        <article class="history-summary-card"><span>Gesamt</span><strong>{{ totalListens }}</strong><small>gehörte Songs</small></article>
        <article class="history-summary-card"><span>Aktive Tage</span><strong>{{ activeDays }}</strong><small>in den letzten 14 Tagen</small></article>
        <article class="history-summary-card"><span>Aktuell gewählt</span><strong>{{ appStore.currentMood || '—' }}</strong><small>letzte Stimmung</small></article>
      </div>

      <p v-if="loadingHistory" class="empty-state">Historie wird geladen...</p>
      <p v-else-if="!appStore.dailyHistory.length" class="empty-state">Noch keine Hörhistorie vorhanden. Starte einen Song, dann erscheint hier dein Zeitstrahl.</p>

      <div v-else class="history-timeline history-timeline-clickable">
        <button v-for="day in appStore.dailyHistory" :key="day.date" type="button" class="history-day history-day-button" @click="openDay(day)">
          <div class="history-date">{{ formatDay(day.date) }}</div>
          <div class="history-line"><span class="history-dot"></span><div class="history-bar" :style="{ width: `${Math.max(12, (day.total / maxTotal) * 100)}%` }"></div></div>
          <div class="history-content">
            <strong>{{ day.total }} Songs gehört</strong>
            <p><span v-for="([mood, count], index) in topEntries(day.moods)" :key="mood">{{ mood }}: {{ count }}<span v-if="index < topEntries(day.moods).length - 1"> · </span></span></p>
          </div>
        </button>
      </div>
    </section>

    <div v-if="selectedDay" class="history-modal-backdrop" @click="closeDay">
      <section class="history-modal" @click.stop>
        <button type="button" class="drawer-close modal-close" @click="closeDay">×</button>
        <p class="page-kicker">Mood Details</p>
        <h2>{{ formatLongDay(selectedDay.date) }}</h2>
        <p class="modal-lead">{{ selectedDay.total }} Songs gehört. Hier siehst du, welche Stimmungen und Songs an diesem Tag vorkamen.</p>

        <div class="history-detail-grid history-detail-grid-single">
          <div class="history-detail-box">
            <h3>Stimmungen</h3>
            <div v-for="([mood, count]) in topEntries(selectedDay.moods, 8)" :key="mood" class="detail-bar-row">
              <span>{{ mood }}</span>
              <div><i :style="{ width: `${percent(count, selectedDay.total)}%` }"></i></div>
              <strong>{{ count }}</strong>
            </div>
          </div>
        </div>

        <div class="history-detail-box history-song-box">
          <h3>Gehörte Songs</h3>
          <p v-if="loadingDetails" class="empty-state">Songs werden geladen...</p>
          <div v-else-if="dayDetails.length" class="history-song-list">
            <article v-for="entry in dayDetails" :key="entry.id" class="history-song-entry">
              <span>{{ formatTime(entry.playedAt) }}</span>
              <div><strong>{{ entry.songTitle }}</strong><small>{{ entry.artist }} · {{ entry.mood }}</small></div>
            </article>
          </div>
          <p v-else class="empty-state">Keine Songdetails vorhanden.</p>
        </div>
      </section>
    </div>
  </main>
</template>
