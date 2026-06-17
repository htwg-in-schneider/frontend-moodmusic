<template>
  <main class="public-page">
    <header class="public-nav">
      <RouterLink to="/" class="public-brand"><span class="brand-dot">♪</span><span>MoodMusic</span></RouterLink>
      <div class="public-actions"><RouterLink to="/login" class="ghost-pill">Login</RouterLink></div>
    </header>
    <section class="public-section">
      <div class="glass-box">
        <span class="label">Datenschutz</span>
        <h1 class="page-heading">Datenschutzerklärung</h1>
        <p class="page-lead">Diese Demo speichert nur notwendige Beispieldaten für Login, Songs, Playlists und Nutzerprofil.</p>
        <p class="page-text">Für eine echte Produktion müssten Auth0, Backend, Datenbank und Hosting vollständig dokumentiert werden.</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
