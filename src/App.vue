<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { appStore } from './store.js'

const route = useRoute()
const router = useRouter()

const isPublicPage = computed(() => route.meta.public === true)
const isAdmin = computed(() => appStore.isAdmin)

function logout() {
  appStore.logout()
  router.push('/')
}
</script>

<template>
  <RouterView v-if="isPublicPage" />

  <div v-else class="spotify-shell">
    <aside class="desktop-sidebar">
      <RouterLink to="/dashboard" class="side-brand">
        <span class="brand-dot">♪</span>
        <span>MoodMusic</span>
      </RouterLink>

      <nav class="side-nav">
        <RouterLink to="/dashboard">Home</RouterLink>
        <RouterLink to="/recommendations">Empfehlungen</RouterLink>
        <RouterLink to="/playlists">Playlists</RouterLink>
        <RouterLink to="/songs">Songs</RouterLink>
        <RouterLink to="/profile">Profil</RouterLink>
        <RouterLink v-if="isAdmin" to="/admin">Admin</RouterLink>
      </nav>

      <div class="side-footer">
        <button type="button" @click="logout">Logout</button>
      </div>
    </aside>

    <section class="content-shell">
      <header class="top-actions">
        <RouterLink to="/profile" class="profile-button">
          <span>{{ appStore.initial }}</span>
          <b>Mein Profil</b>
        </RouterLink>

        <button type="button" class="logout-button" @click="logout">
          Logout
        </button>
      </header>

      <RouterView />
    </section>

    <nav class="mobile-bottom-nav">
      <RouterLink to="/dashboard">⌂<span>Home</span></RouterLink>
      <RouterLink to="/recommendations">⌕<span>Suche</span></RouterLink>
      <RouterLink to="/playlists">▤<span>Playlists</span></RouterLink>
      <RouterLink to="/songs">♪<span>Songs</span></RouterLink>
      <RouterLink to="/profile">●<span>Profil</span></RouterLink>
    </nav>

    <section v-if="appStore.currentSong && appStore.miniPlayerVisible" class="mini-player">
      <div class="mini-cover">♪</div>

      <div class="mini-info">
        <p class="mini-title">{{ appStore.currentSong.titel }}</p>
        <p class="mini-artist">{{ appStore.currentSong.kuenstler }}</p>
      </div>

      <div class="mini-controls">
        <button type="button" aria-label="Vorheriger Song" title="Vorheriger Song" @click="appStore.previousSong()">
          ⏮
        </button>
        <button type="button" class="control-main" aria-label="Play/Pause" title="Play/Pause" @click="appStore.togglePlay()">
          {{ appStore.isPlaying ? '⏸' : '▶' }}
        </button>
        <button type="button" aria-label="Nächster Song" title="Nächster Song" @click="appStore.nextSong()">
          ⏭
        </button>
        <button type="button" aria-label="Zufällige Wiedergabe" title="Shuffle" :class="{ active: appStore.shuffle }" @click="appStore.toggleShuffle()">
          🔀
        </button>
        <button type="button" class="control-close" aria-label="Player schließen" title="Schließen" @click="appStore.closeMiniPlayer()">
          ✕
        </button>
      </div>
    </section>
  </div>
</template>
