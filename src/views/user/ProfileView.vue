<script setup>
import { ref } from 'vue'
import { appStore } from '../../store.js'

const name = ref(appStore.user?.name || '')
const email = ref(appStore.user?.email || '')
const address = ref(appStore.user?.address || '')
const password = ref('')
const saved = ref(false)
const errorMessage = ref('')
const loading = ref(false)

async function save() {
  loading.value = true
  errorMessage.value = ''
  try {
    await appStore.updateProfile({
      name: name.value,
      email: email.value,
      address: address.value,
      ...(password.value ? { password: password.value } : {})
    })
    saved.value = true
    password.value = ''
    setTimeout(() => saved.value = false, 2500)
  } catch (error) {
    errorMessage.value = error.message || 'Profil konnte nicht gespeichert werden.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Profil</p>
    <h1 class="page-heading">Mein Profil</h1>
    <p class="page-lead">Ändere deine Nutzerdaten. Die Daten werden im Backend gespeichert.</p>

    <form class="profile-card form-grid" @submit.prevent="save">
      <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>
      <div class="form-row"><label>Name</label><input v-model="name"></div>
      <div class="form-row"><label>E-Mail</label><input v-model="email" type="email"></div>
      <div class="form-row"><label>Adresse</label><input v-model="address"></div>
      <div class="form-row"><label>Neues Passwort optional</label><input v-model="password" type="password" placeholder="leer lassen, wenn unverändert"></div>
      <button type="submit" class="primary-pill" :disabled="loading">{{ loading ? 'Speichert...' : 'Speichern' }}</button>
      <p v-if="saved" class="empty-state">Profil gespeichert.</p>
    </form>
  </main>
</template>
