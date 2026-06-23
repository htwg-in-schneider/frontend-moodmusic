<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { resetPassword } from '../../services/authService.js'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const message = ref('')
const errorMessage = ref('')
const form = reactive({ password: '', repeatPassword: '' })

async function submit() {
  message.value = ''
  errorMessage.value = ''
  if (!route.query.token) {
    errorMessage.value = 'Der Reset-Link ist ungültig.'
    return
  }
  if (form.password.length < 4) {
    errorMessage.value = 'Das neue Passwort muss mindestens 4 Zeichen haben.'
    return
  }
  if (form.password !== form.repeatPassword) {
    errorMessage.value = 'Die Passwörter stimmen nicht überein.'
    return
  }
  loading.value = true
  try {
    await resetPassword(String(route.query.token), form.password)
    message.value = 'Dein Passwort wurde geändert. Du kannst dich jetzt einloggen.'
    setTimeout(() => router.push('/login'), 1200)
  } catch (error) {
    errorMessage.value = error.message || 'Passwort konnte nicht geändert werden.'
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
        <h1>Neues Passwort</h1>
        <p>Lege ein neues Passwort für deinen Account fest.</p>
      </div>
      <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>
      <p v-if="message" class="form-success">{{ message }}</p>
      <div class="form-row"><label>Neues Passwort</label><input v-model="form.password" type="password"></div>
      <div class="form-row"><label>Passwort wiederholen</label><input v-model="form.repeatPassword" type="password"></div>
      <button class="primary-pill" type="submit" :disabled="loading">{{ loading ? 'Speichert...' : 'Passwort speichern' }}</button>
    </form>
  </main>
</template>
