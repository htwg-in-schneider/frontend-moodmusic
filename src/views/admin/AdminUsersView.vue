<script setup>
import { onMounted, ref } from 'vue'
import { getUsers, deleteUser } from '../../services/authService.js'
import { appStore } from '../../store.js'

const users = ref([])
const loading = ref(false)
const errorMessage = ref('')
const openMenuId = ref(null)
const userToDelete = ref(null)
const deleting = ref(false)

async function loadUsers() {
  loading.value = true
  errorMessage.value = ''
  try {
    users.value = await getUsers()
  } catch (error) {
    errorMessage.value = error.message || 'Nutzer konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

function isCurrentUser(user) {
  return Number(user.id) === Number(appStore.user?.id)
}

function askDeleteUser(user) {
  if (isCurrentUser(user)) return
  userToDelete.value = user
  openMenuId.value = null
}

async function confirmDeleteUser() {
  if (!userToDelete.value) return
  deleting.value = true
  errorMessage.value = ''
  try {
    await deleteUser(userToDelete.value.id)
    userToDelete.value = null
    await loadUsers()
  } catch (error) {
    errorMessage.value = error.message || 'Nutzer konnte nicht gelöscht werden.'
  } finally {
    deleting.value = false
  }
}

function toggleMenu(userId) {
  openMenuId.value = openMenuId.value === userId ? null : userId
}

onMounted(loadUsers)
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Admin</p>
    <h1 class="page-heading">Nutzer</h1>
    <p class="page-lead">Nutzer werden in Supabase Postgres gespeichert. Admins können andere Nutzer löschen.</p>

    <p v-if="loading" class="empty-state">Nutzer werden geladen...</p>
    <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>

    <section v-if="!loading && users.length" class="list-card spotify-section admin-list-card">
      <div v-for="user in users" :key="user.id" class="song-row user-admin-row readonly-user-row">
        <div class="song-index">●</div>

        <div class="song-title user-title-wrap">
          <strong>{{ user.name || 'Unbekannter Nutzer' }}</strong>
          <span>{{ user.email }}</span>
        </div>

        <span class="role-badge hide-mobile">{{ user.role }}</span>

        <div class="song-actions actions-with-menu">
          <button
            v-if="!isCurrentUser(user)"
            class="icon-btn"
            type="button"
            title="Weitere Aktionen"
            @click="toggleMenu(user.id)"
          >
            ⋯
          </button>

          <span v-else class="self-user-label">Du</span>

          <div v-if="openMenuId === user.id" class="action-menu">
            <button type="button" class="danger-action" @click="askDeleteUser(user)">
              Nutzer löschen
            </button>
          </div>
        </div>
      </div>
    </section>

    <div v-if="userToDelete" class="confirm-backdrop" @click.self="userToDelete = null">
      <section class="confirm-modal">
        <h2>Nutzer löschen?</h2>
        <p>Sind Sie sicher, dass Sie <strong>{{ userToDelete.name }}</strong> löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.</p>
        <div class="confirm-actions">
          <button type="button" class="ghost-pill" @click="userToDelete = null">Abbrechen</button>
          <button type="button" class="danger-pill" :disabled="deleting" @click="confirmDeleteUser">
            {{ deleting ? 'Löscht...' : 'Ja, löschen' }}
          </button>
        </div>
      </section>
    </div>
  </main>
</template>
