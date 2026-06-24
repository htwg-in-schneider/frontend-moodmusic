<template>
  <main class="public-page">
    <header class="public-nav">
      <RouterLink to="/" class="public-brand"><span class="brand-dot">♪</span><span>MoodMusic</span></RouterLink>
      <div class="public-actions"><RouterLink to="/login" class="ghost-pill">Login</RouterLink></div>
    </header>
    <section class="public-section legal-section">
      <div class="glass-box legal-box">
        <div class="legal-actions">
          <RouterLink to="/" class="ghost-pill">← Zurück</RouterLink>
        </div>
        <span class="label">Datenschutz</span>
        <h1 class="page-heading legal-title">Datenschutz</h1>
        <p class="page-lead">MoodMusic speichert nur Daten, die für die Nutzung der App notwendig sind.</p>
        <p class="page-text">
          Gespeichert werden können: Name, E-Mail-Adresse, verschlüsseltes Passwort, optionales Profilbild, Playlists, Likes, hochgeladene Songs und Hörverlauf. Passwörter werden nicht im Klartext gespeichert, sondern als Hash im Backend abgelegt.
          <br><br>
          Hochgeladene Musik- und Bilddateien werden in Supabase Storage gespeichert. Die Datenbank enthält dazu Metadaten wie Titel, Künstler, Stimmung, Dateipfad und Erstellerinformationen.
          <br><br>
          Die Kontaktfunktion öffnet dein lokales E-Mail-Programm und bereitet eine Nachricht an <a href="mailto:rogerschlude12345@gmail.com">rogerschlude12345@gmail.com</a> vor. Die E-Mail wird erst über dein eigenes Mailprogramm versendet.
          <br><br>
          Dieses Projekt ist ein Studienprojekt.
          </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
