<template>
  <main class="public-page">
    <header class="public-nav">
      <RouterLink to="/" class="public-brand"><span class="brand-dot">♪</span><span>MoodMusic</span></RouterLink>
      <div class="public-actions"><RouterLink to="/login" class="ghost-pill">Login</RouterLink></div>
    </header>
    <section class="public-section">
      <div class="glass-box">
        <span class="label">Rechtliches</span>
        <h1 class="page-heading">Impressum</h1>
        <p class="page-lead">MoodMusic Demo-Projekt im Rahmen Web-Technologien.</p>
        <p class="page-text">Betreiber: MoodMusic Team<br>Adresse: HTWG Konstanz<br>E-Mail: demo@moodmusic.de</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
