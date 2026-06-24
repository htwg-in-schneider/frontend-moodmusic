<script setup>
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { appStore } from './store.js'
import { resolveImageUrl } from './services/api.js'

const route = useRoute()
const router = useRouter()
const mobileMenuOpen = ref(false)

const isPublicPage = computed(() => route.meta.public === true)
const isAdmin = computed(() => appStore.isAdmin)
const profileImage = computed(() => appStore.user?.profileImageUrl ? resolveImageUrl(appStore.user.profileImageUrl) : '')

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function logout() {
  appStore.logout()
  closeMobileMenu()
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
        <button type="button" class="mobile-menu-button" @click="mobileMenuOpen = true">
          ☰
        </button>

        <RouterLink to="/profile" class="profile-button">
          <span class="profile-button-avatar">
            <img v-if="profileImage" :src="profileImage" alt="Profilbild">
            <template v-else>{{ appStore.initial }}</template>
          </span>
          <b>Mein Profil</b>
        </RouterLink>

        <button type="button" class="logout-button" @click="logout">
          Logout
        </button>
      </header>

      <RouterView />
    </section>

    <div v-if="mobileMenuOpen" class="mobile-drawer-backdrop" @click="closeMobileMenu"></div>

    <aside class="mobile-drawer" :class="{ open: mobileMenuOpen }">
      <div class="mobile-drawer-head">
        <RouterLink to="/dashboard" class="side-brand" @click="closeMobileMenu">
          <span class="brand-dot">♪</span>
          <span>MoodMusic</span>
        </RouterLink>
        <button type="button" class="drawer-close" @click="closeMobileMenu">×</button>
      </div>

      <RouterLink to="/profile" class="drawer-profile" @click="closeMobileMenu">
        <span class="drawer-avatar">
          <img v-if="profileImage" :src="profileImage" alt="Profilbild">
          <template v-else>{{ appStore.initial }}</template>
        </span>
        <span>
          <strong>{{ appStore.displayName }}</strong>
          <small>{{ appStore.user?.email }}</small>
        </span>
      </RouterLink>

      <nav class="drawer-nav">
        <RouterLink to="/dashboard" @click="closeMobileMenu">Home</RouterLink>
        <RouterLink to="/playlists" @click="closeMobileMenu">Playlists</RouterLink>
        <RouterLink to="/songs" @click="closeMobileMenu">Songs</RouterLink>
        <RouterLink to="/profile" @click="closeMobileMenu">Profil</RouterLink>
        <RouterLink v-if="isAdmin" to="/admin" @click="closeMobileMenu">Admin</RouterLink>
      </nav>

      <button type="button" class="drawer-logout" @click="logout">Logout</button>
    </aside>

    <section v-if="appStore.currentSong && appStore.miniPlayerVisible" class="mini-player">
      <div class="mini-cover">♪</div>

      <div class="mini-info">
        <p class="mini-title">{{ appStore.currentSong.titel }}</p>
        <p class="mini-artist">{{ appStore.currentSong.kuenstler }}</p>
      </div>

      <div class="mini-controls">
        <button type="button" aria-label="10 Sekunden zurück" title="10 Sekunden zurück" @click="appStore.seekBy(-10)">
          ↶
        </button>
        <button type="button" aria-label="Vorheriger Song" title="Vorheriger Song" @click="appStore.previousSong()">
          ⏮
        </button>
        <button type="button" class="control-main" aria-label="Play/Pause" title="Play/Pause" @click="appStore.togglePlay()">
          {{ appStore.isPlaying ? '⏸' : '▶' }}
        </button>
        <button type="button" aria-label="Nächster Song" title="Nächster Song" @click="appStore.nextSong()">
          ⏭
        </button>
        <button type="button" aria-label="10 Sekunden vor" title="10 Sekunden vor" @click="appStore.seekBy(10)">
          ↷
        </button>
        <button type="button" aria-label="Zufällige Wiedergabe" title="Shuffle" :class="{ active: appStore.shuffle }" @click="appStore.toggleShuffle()">
          🔀
        </button>
        <button type="button" class="control-close" aria-label="Player schließen" title="Schließen" @click="appStore.closeMiniPlayer()">
          ✕
        </button>
      </div>

      <div class="mini-progress">
        <span>{{ appStore.formatTime(appStore.currentTime) }}</span>
        <input
          type="range"
          min="0"
          :max="appStore.duration || 0"
          step="0.1"
          :value="appStore.currentTime"
          :disabled="!appStore.duration"
          :style="{ '--progress': appStore.progressPercent + '%' }"
          aria-label="Songposition"
          @input="appStore.seekTo(Number($event.target.value))"
        >
        <span>{{ appStore.formatTime(appStore.duration) }}</span>
      </div>
    </section>
  </div>
</template>
