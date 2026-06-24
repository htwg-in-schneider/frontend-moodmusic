<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { getPlaylists, deletePlaylist } from '../../services/playlistService.js'
import { resolveImageUrl } from '../../services/api.js'

const playlists = ref([])
const search = ref('')
const loading = ref(false)
const errorMessage = ref('')
const openMenuId = ref(null)
const playlistToDelete = ref(null)
const deleting = ref(false)

const filteredPlaylists = computed(() => {
  const q = String(search.value || '').trim().toLowerCase()

  return playlists.value.filter(playlist => {
    const title = String(playlist.titel || '').toLowerCase()
    const creator = String(playlist.creatorName || '').toLowerCase()
    const mood = String(playlist.stimmungsKategorie || '').toLowerCase()

    return !q || title.includes(q) || creator.includes(q) || mood.includes(q)
  })
})

async function loadPlaylists() {
  loading.value = true
  errorMessage.value = ''

  try {
    playlists.value = await getPlaylists()
  } catch (error) {
    errorMessage.value = error.message || 'Playlists konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

function askDeletePlaylist(playlist) {
  playlistToDelete.value = playlist
  openMenuId.value = null
}

async function confirmDeletePlaylist() {
  if (!playlistToDelete.value) return

  deleting.value = true
  errorMessage.value = ''

  try {
    await deletePlaylist(playlistToDelete.value.id)
    playlistToDelete.value = null
    await loadPlaylists()
  } catch (error) {
    errorMessage.value = error.message || 'Playlist konnte nicht gelöscht werden.'
  } finally {
    deleting.value = false
  }
}

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id
}

onMounted(loadPlaylists)

watch(search, () => {
  openMenuId.value = null
})
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Admin</p>
    <h1 class="page-heading">Playlists</h1>
    <p class="page-lead">
      Hier verwaltest du alle Playlists, die von Nutzern erstellt wurden.
    </p>

    <section class="filter-panel playlist-admin-panel">
      <input v-model="search" placeholder="Playlist, Stimmung oder Ersteller suchen...">
      <RouterLink to="/playlists/create" class="primary-pill">
        Neue Playlist
      </RouterLink>
    </section>

    <p v-if="loading" class="empty-state">Playlists werden geladen...</p>
    <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>

    <section v-if="!loading && filteredPlaylists.length" class="list-card spotify-section">
      <div
        v-for="playlist in filteredPlaylists"
        :key="playlist.id"
        class="song-row admin-playlist-row"
      >
        <RouterLink :to="`/playlists/${playlist.id}`" class="playlist-admin-cover">
          <img
            v-if="playlist.coverImageUrl"
            :src="resolveImageUrl(playlist.coverImageUrl)"
            alt="Playlist Cover"
          >
          <span v-else>▤</span>
        </RouterLink>

        <div class="song-title">
          <strong>{{ playlist.titel }}</strong>
          <span>
            {{ playlist.stimmungsKategorie || 'Keine Stimmung' }}
            · von {{ playlist.creatorName || 'Unbekannt' }}
          </span>
        </div>

        <small class="hide-mobile">{{ playlist.songs?.length || 0 }} Songs</small>
        <small class="hide-mobile">{{ playlist.likes || 0 }} Likes</small>

        <div class="song-actions actions-with-menu">
          <RouterLink
            :to="`/playlists/${playlist.id}/edit`"
            class="icon-btn"
            title="Bearbeiten"
          >
            ✎
          </RouterLink>

          <button
            class="icon-btn"
            type="button"
            title="Weitere Aktionen"
            @click="toggleMenu(playlist.id)"
          >
            ⋯
          </button>

          <div v-if="openMenuId === playlist.id" class="action-menu">
            <RouterLink :to="`/playlists/${playlist.id}`">
              Öffnen
            </RouterLink>

            <RouterLink :to="`/playlists/${playlist.id}/edit`">
              Bearbeiten
            </RouterLink>

            <button
              type="button"
              class="danger-action"
              @click="askDeletePlaylist(playlist)"
            >
              Playlist löschen
            </button>
          </div>
        </div>
      </div>
    </section>

    <p v-if="!loading && !filteredPlaylists.length" class="empty-state">
      Keine Playlists gefunden.
    </p>

    <div
      v-if="playlistToDelete"
      class="confirm-backdrop"
      @click.self="playlistToDelete = null"
    >
      <section class="confirm-modal">
        <h2>Playlist löschen?</h2>

        <p>
          Sind Sie sicher, dass Sie
          <strong>{{ playlistToDelete.titel }}</strong>
          löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
        </p>

        <div class="confirm-actions">
          <button
            type="button"
            class="ghost-pill"
            @click="playlistToDelete = null"
          >
            Abbrechen
          </button>

          <button
            type="button"
            class="danger-pill"
            :disabled="deleting"
            @click="confirmDeletePlaylist"
          >
            {{ deleting ? 'Löscht...' : 'Ja, löschen' }}
          </button>
        </div>
      </section>
    </div>
  </main>
</template>