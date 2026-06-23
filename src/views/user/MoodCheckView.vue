<template>
  <section class="page">
    <div class="glass-card">
      <h1>Stimmung erfassen</h1>
      <p>Wähle deine aktuelle Stimmung.</p>

      <div class="mood-grid">
        <RouterLink to="/recommendations?mood=Glücklich" class="mood-button">Glücklich</RouterLink>
        <RouterLink to="/recommendations?mood=Traurig" class="mood-button">Traurig</RouterLink>
        <RouterLink to="/recommendations?mood=Energiegeladen" class="mood-button">Energiegeladen</RouterLink>
        <RouterLink to="/recommendations?mood=Entspannt" class="mood-button">Entspannt</RouterLink>
        <RouterLink to="/recommendations?mood=Fokus" class="mood-button">Fokus</RouterLink>
        <RouterLink to="/recommendations?mood=Neutral" class="mood-button">Neutral</RouterLink>
      </div>
    </div>
  </section>
</template>