<template>
  <main class="public-page">
    <header class="public-nav">
      <RouterLink to="/" class="public-brand"><span class="brand-dot">♪</span><span>MoodMusic</span></RouterLink>
      <div class="public-actions"><RouterLink to="/login" class="ghost-pill">Login</RouterLink></div>
    </header>
    <section class="public-section">
      <div class="glass-box legal-box">
        <span class="label">Datenschutz</span>
        <h1 class="page-heading">Datenschutzerklärung</h1>
        <p class="page-lead">MoodMusic speichert nur Daten, die für die Nutzung der App notwendig sind.</p>
        <p class="page-text">
          Gespeichert werden können: Name, E-Mail-Adresse, verschlüsseltes Passwort, optionales Profilbild, Playlists, Likes, hochgeladene Songs und Hörverlauf. Passwörter werden nicht im Klartext gespeichert, sondern als Hash im Backend abgelegt.
          <br><br>
          Hochgeladene Musik- und Bilddateien werden im Backend-Dateisystem gespeichert. Die Datenbank enthält dazu nur Metadaten und Dateipfade.
          <br><br>
          Die Kontaktfunktion öffnet das lokale E-Mail-Programm und sendet die Nachricht an <a href="mailto:rogerschlude12345@gmail.com">rogerschlude12345@gmail.com</a>. Dabei wird die E-Mail über dein eigenes Mailprogramm verschickt.
          <br><br>
          Dieses Projekt ist ein Studienprojekt. Für einen echten Produktivbetrieb müssten Hosting, Backups, Löschkonzepte, Rollenrechte und E-Mail-Versand zusätzlich vollständig geprüft und dokumentiert werden.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
