<template>
  <main class="public-page">
    <header class="public-nav">
      <RouterLink to="/" class="public-brand"><span class="brand-dot">♪</span><span>MoodMusic</span></RouterLink>
      <div class="public-actions"><RouterLink to="/login" class="ghost-pill">Login</RouterLink></div>
    </header>
    <section class="public-section">
      <div class="glass-box legal-box">
        <span class="label">Rechtliches</span>
        <h1 class="page-heading">Impressum</h1>
        <p class="page-lead">Angaben gemäß § 5 TMG für das Hochschulprojekt MoodMusic.</p>
        <p class="page-text">
          Verantwortlich für dieses Projekt:<br>
          Roger Schlude<br>
          HTWG Konstanz<br><br>
          E-Mail: <a href="mailto:rogerschlude12345@gmail.com">rogerschlude12345@gmail.com</a><br><br>
          MoodMusic ist ein nicht-kommerzielles Studienprojekt. Die Anwendung dient der Demonstration einer Web-App mit Frontend, Backend, Nutzerverwaltung, Musikverwaltung, Playlists und Hörhistorie.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
