<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getPlaylists, deletePlaylist as deletePlaylistApi } from '../services/playlistService.js'

const playlists = ref([])
const loading = ref(false)
const errorMessage = ref('')

async function loadPlaylists() {
  loading.value = true
  errorMessage.value = ''

  try {
    playlists.value = await getPlaylists()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Playlists konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

async function deletePlaylist(id) {
  try {
    await deletePlaylistApi(id)
    await loadPlaylists()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Playlist konnte nicht gelöscht werden.'
  }
}

onMounted(() => {
  loadPlaylists()
})
</script>

<template>
  <div class="playlist-list">
    <div class="header">
      <h1>Alle Playlists</h1>
      <RouterLink to="/playlists/create" class="btn-create">
        + Neue Playlist
      </RouterLink>
    </div>

    <p v-if="loading" class="no-results">
      Playlists werden geladen...
    </p>

    <p v-if="errorMessage" class="no-results">
      {{ errorMessage }}
    </p>

    <div v-if="!loading && playlists.length > 0" class="playlist-cards">
      <div 
        v-for="playlist in playlists" 
        :key="playlist.id" 
        class="playlist-card"
      >
        <div class="card-header">
          <h2>{{ playlist.titel }}</h2>
          <span class="badge">{{ playlist.stimmungsKategorie }}</span>
        </div>

        <p class="song-count">
          {{ playlist.songs?.length || 0 }} Songs
        </p>

        <ul class="song-preview">
          <li 
            v-for="song in playlist.songs || []" 
            :key="song.id"
          >
            {{ song.titel }} – {{ song.kuenstler }}
          </li>
        </ul>

        <div class="card-actions">
          <RouterLink 
            :to="'/playlists/' + playlist.id + '/edit'" 
            class="btn-edit"
          >
            Bearbeiten
          </RouterLink>

          <button 
            @click="deletePlaylist(playlist.id)" 
            class="btn-delete"
          >
            Löschen
          </button>
        </div>
      </div>
    </div>

    <p v-if="!loading && playlists.length === 0" class="no-results">
      Noch keine Playlists erstellt.
    </p>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h1 {
  font-size: 28px;
}

.btn-create {
  background: #9333EA;
  color: white;
  padding: 10px 24px;
  border-radius: 100px;
  text-decoration: none;
  font-size: 14px;
}

.playlist-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.playlist-card {
  background: #140A28;
  border: 1px solid rgba(147, 51, 234, 0.2);
  border-radius: 16px;
  padding: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header h2 {
  font-size: 18px;
}

.badge {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 100px;
  background: rgba(147, 51, 234, 0.15);
  color: #C084FC;
}

.song-count {
  font-size: 13px;
  color: #9CA3AF;
  margin-bottom: 12px;
}

.song-preview {
  list-style: none;
  margin-bottom: 20px;
  padding: 0;
}

.song-preview li {
  font-size: 13px;
  color: #FFFFFF;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn-edit {
  color: #C084FC;
  text-decoration: none;
  font-size: 13px;
  padding: 6px 12px;
  border: 1px solid rgba(147, 51, 234, 0.3);
  border-radius: 6px;
}

.btn-delete {
  color: #F472B6;
  background: transparent;
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
}

.no-results {
  text-align: center;
  color: #9CA3AF;
  margin-top: 32px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .playlist-cards {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
  }

  .btn-edit,
  .btn-delete {
    width: 100%;
    text-align: center;
  }
}
</style>