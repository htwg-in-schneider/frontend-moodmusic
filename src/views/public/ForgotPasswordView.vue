<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { requestPasswordReset } from '../../services/authService.js'

const email = ref('')
const loading = ref(false)
const message = ref('')
const errorMessage = ref('')
const devResetLink = ref('')

async function submit() {
  if (!email.value) {
    errorMessage.value = 'Bitte gib deine E-Mail-Adresse ein.'
    return
  }
  loading.value = true
  message.value = ''
  errorMessage.value = ''
  devResetLink.value = ''
  try {
    const response = await requestPasswordReset(email.value)
    message.value = response.message || 'Wenn diese E-Mail registriert ist, wurde ein Link versendet.'
    devResetLink.value = response.devResetLink || ''
  } catch (error) {
    errorMessage.value = error.message || 'Die Anfrage konnte nicht gesendet werden.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <form class="auth-card form-grid" @submit.prevent="submit">
      <RouterLink to="/" class="public-brand"><span class="brand-dot">♪</span><span>MoodMusic</span></RouterLink>
      <div>
        <h1>Passwort zurücksetzen</h1>
        <p>Gib deine E-Mail-Adresse ein. Du erhältst einen Link, mit dem du ein neues Passwort setzen kannst.</p>
      </div>
      <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>
      <p v-if="message" class="form-success">{{ message }}</p>
      <div class="form-row"><label>E-Mail</label><input v-model="email" type="email" placeholder="deine@mail.de"></div>
      <button class="primary-pill" type="submit" :disabled="loading">{{ loading ? 'Sendet...' : 'Link senden' }}</button>
      <a v-if="devResetLink" class="ghost-pill" :href="devResetLink">Lokalen Reset-Link öffnen</a>
      <div class="auth-links"><RouterLink to="/login">Zurück zum Login</RouterLink></div>
    </form>
  </main>
</template>
