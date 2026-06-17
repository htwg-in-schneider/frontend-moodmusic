<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
const email = ref('')
const sent = ref(false)
</script>

<template>
  <main class="auth-page">
    <form class="auth-card form-grid" @submit.prevent="sent = true">
      <RouterLink to="/" class="public-brand"><span class="brand-dot">♪</span><span>MoodMusic</span></RouterLink>
      <div>
        <h1>Passwort vergessen?</h1>
        <p>Gib deine E-Mail ein. Für die Demo wird nur eine Meldung angezeigt.</p>
      </div>
      <div class="form-row"><label>E-Mail</label><input v-model="email" type="email" placeholder="deine@mail.de"></div>
      <button class="primary-pill" type="submit">Link senden</button>
      <p v-if="sent" class="empty-state">Wenn diese E-Mail existiert, wurde ein Link gesendet.</p>
      <div class="auth-links"><RouterLink to="/login">Zurück zum Login</RouterLink></div>
    </form>
  </main>
</template>
