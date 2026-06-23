<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { appStore } from '../../store.js'

const router = useRouter()
const route = useRoute()
const email = ref('user@moodmusic.de')
const password = ref('demo123')
const errorMessage = ref('')
const loading = ref(false)

async function login() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Bitte E-Mail und Passwort eingeben.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  try {
    await appStore.login(email.value, password.value)
    router.push(route.query.redirect || '/dashboard')
  } catch (error) {
    errorMessage.value = error.message || 'Login fehlgeschlagen.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <form class="auth-card form-grid" @submit.prevent="login">
      <RouterLink to="/" class="public-brand"><span class="brand-dot">♪</span><span>MoodMusic</span></RouterLink>
      <div>
        <h1>Login</h1>
        <p>Willkommen zurück. Melde dich an und starte deine Musik passend zu deiner Stimmung.</p>
      </div>
      <div v-if="errorMessage" class="empty-state">{{ errorMessage }}</div>
      <div class="form-row"><label>E-Mail</label><input v-model="email" type="email"></div>
      <div class="form-row"><label>Passwort</label><input v-model="password" type="password"></div>
      <button class="primary-pill" type="submit" :disabled="loading">{{ loading ? 'Lädt...' : 'Anmelden' }}</button>
      <div class="auth-links">
        <RouterLink to="/register">Registrieren</RouterLink>
        <RouterLink to="/forgot-password">Passwort vergessen?</RouterLink>
      </div>
    </form>
  </main>
</template>
