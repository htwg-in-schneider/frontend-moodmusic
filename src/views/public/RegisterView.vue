<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { appStore } from '../../store.js'

const router = useRouter()
const name = ref('')
const email = ref('')
const address = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function register() {
  if (!name.value || !email.value || password.value.length < 4) {
    errorMessage.value = 'Bitte Name, E-Mail und Passwort eingeben.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  try {
    await appStore.register({ name: name.value, email: email.value, address: address.value, password: password.value })
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.message || 'Registrierung fehlgeschlagen.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <form class="auth-card form-grid" @submit.prevent="register">
      <RouterLink to="/" class="public-brand"><span class="brand-dot">♪</span><span>MoodMusic</span></RouterLink>
      <div>
        <h1>Registrieren</h1>
        <p>Erstelle deinen Account und speichere Playlists, Likes und deinen Hörverlauf.</p>
      </div>
      <div v-if="errorMessage" class="empty-state">{{ errorMessage }}</div>
      <div class="form-row"><label>Name</label><input v-model="name" placeholder="Dein Name"></div>
      <div class="form-row"><label>E-Mail</label><input v-model="email" type="email" placeholder="deine@mail.de"></div>
      <div class="form-row"><label>Adresse</label><input v-model="address" placeholder="Straße, Ort"></div>
      <div class="form-row"><label>Passwort</label><input v-model="password" type="password"></div>
      <button class="primary-pill" type="submit" :disabled="loading">{{ loading ? 'Speichert...' : 'Konto erstellen' }}</button>
      <div class="auth-links"><RouterLink to="/login">Schon registriert?</RouterLink></div>
    </form>
  </main>
</template>
