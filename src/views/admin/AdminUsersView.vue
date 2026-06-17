<script setup>
import { onMounted, ref } from 'vue'
import { getUsers, updateUser, deleteUser } from '../../services/authService.js'
import { appStore } from '../../store.js'

const users = ref([])
const loading = ref(false)
const errorMessage = ref('')

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

async function saveUser(user) {
  await updateUser(user.id, user)
  await loadUsers()
}

async function removeUser(user) {
  if (Number(user.id) === Number(appStore.user?.id)) return
  await deleteUser(user.id)
  await loadUsers()
}

onMounted(loadUsers)
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Admin</p>
    <h1 class="page-heading">Nutzer</h1>
    <p class="page-lead">Nutzer werden im Backend gespeichert. Admin kann Name, Adresse und Rolle bearbeiten.</p>

    <p v-if="loading" class="empty-state">Nutzer werden geladen...</p>
    <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>

    <section v-if="!loading && users.length" class="list-card spotify-section">
      <div v-for="user in users" :key="user.id" class="song-row user-admin-row">
        <div class="song-index">●</div>
        <div class="song-title">
          <strong>{{ user.name }}</strong>
          <span>{{ user.email }}</span>
        </div>
        <input v-model="user.name" class="hide-mobile">
        <input v-model="user.address" class="hide-mobile">
        <select v-model="user.role" class="hide-mobile">
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <div class="song-actions">
          <button class="icon-btn" type="button" @click="saveUser(user)">✓</button>
          <button class="icon-btn" type="button" :disabled="Number(user.id) === Number(appStore.user?.id)" @click="removeUser(user)">×</button>
        </div>
      </div>
    </section>
  </main>
</template>
