<script setup>
import { reactive, ref } from 'vue'
import { appStore } from '../../store.js'
import { changePassword, uploadProfileImage, deleteProfileImage } from '../../services/authService.js'
import { resolveImageUrl } from '../../services/api.js'

const profile = reactive({
  name: appStore.user?.name || ''
})

const passwords = reactive({
  oldPassword: '',
  newPassword: '',
  repeatPassword: ''
})

const profileMessage = ref('')
const passwordMessage = ref('')
const errorMessage = ref('')
const imagePreview = ref(appStore.user?.profileImageUrl ? resolveImageUrl(appStore.user.profileImageUrl) : '')
const savingProfile = ref(false)
const savingPassword = ref(false)
const profileInput = ref(null)
const selectedImageName = ref('')

async function saveProfile() {
  savingProfile.value = true
  errorMessage.value = ''
  profileMessage.value = ''
  try {
    await appStore.updateProfile(profile)
    profileMessage.value = 'Profil gespeichert.'
  } catch (error) {
    errorMessage.value = error.message || 'Profil konnte nicht gespeichert werden.'
  } finally {
    savingProfile.value = false
  }
}

async function onImageChange(event) {
  const file = event.target.files?.[0]
  if (!file || !appStore.user?.id) return
  selectedImageName.value = file.name
  imagePreview.value = URL.createObjectURL(file)
  try {
    const user = await uploadProfileImage(appStore.user.id, file)
    appStore.setUser(user)
    profileMessage.value = 'Profilbild gespeichert.'
  } catch (error) {
    errorMessage.value = error.message || 'Profilbild konnte nicht gespeichert werden.'
  }
}

async function removeProfileImage() {
  if (!appStore.user?.id) return
  errorMessage.value = ''
  profileMessage.value = ''
  try {
    const user = await deleteProfileImage(appStore.user.id)
    appStore.setUser(user)
    imagePreview.value = ''
    selectedImageName.value = ''
    if (profileInput.value) profileInput.value.value = ''
    profileMessage.value = 'Profilbild entfernt. Standard-Avatar ist wieder aktiv.'
  } catch (error) {
    errorMessage.value = error.message || 'Profilbild konnte nicht gelöscht werden.'
  }
}

async function savePassword() {
  passwordMessage.value = ''
  errorMessage.value = ''
  if (!passwords.oldPassword || passwords.newPassword.length < 4) {
    errorMessage.value = 'Bitte altes Passwort und ein neues Passwort mit mindestens 4 Zeichen eingeben.'
    return
  }
  if (passwords.newPassword !== passwords.repeatPassword) {
    errorMessage.value = 'Die neuen Passwörter stimmen nicht überein.'
    return
  }
  savingPassword.value = true
  try {
    const user = await changePassword(passwords.oldPassword, passwords.newPassword)
    appStore.setUser(user)
    passwords.oldPassword = ''
    passwords.newPassword = ''
    passwords.repeatPassword = ''
    passwordMessage.value = 'Passwort wurde geändert.'
  } catch (error) {
    errorMessage.value = error.message || 'Passwort konnte nicht geändert werden.'
  } finally {
    savingPassword.value = false
  }
}
</script>

<template>
  <main class="app-page">
    <p class="page-kicker">Profil</p>
    <h1 class="page-heading">Mein Profil</h1>
    <p class="page-lead">Verwalte deinen Namen, dein Profilbild und dein Passwort.</p>

    <p v-if="errorMessage" class="empty-state">{{ errorMessage }}</p>

    <section class="profile-layout">
      <form class="profile-card form-grid" @submit.prevent="saveProfile">
        <h2>Profil bearbeiten</h2>
        <div class="profile-image-editor">
          <div class="profile-image-preview">
            <img v-if="imagePreview" :src="imagePreview" alt="Profilbild">
            <span v-else>{{ appStore.initial }}</span>
          </div>
          <div class="form-row">
            <label>Profilbild</label>
            <input ref="profileInput" class="hidden-file-input" type="file" accept="image/*" @change="onImageChange">
            <button type="button" class="file-picker" @click="profileInput?.click()">
              <span>Bild auswählen</span>
              <small>{{ selectedImageName || (imagePreview ? 'Aktuelles Profilbild aktiv' : 'Standard-Avatar aktiv') }}</small>
            </button>
            <button v-if="imagePreview" type="button" class="ghost-pill" @click="removeProfileImage">Profilbild löschen</button>
          </div>
        </div>

        <div class="form-row"><label>Name</label><input v-model="profile.name" placeholder="Dein Name"></div>
        <button class="primary-pill" type="submit" :disabled="savingProfile">{{ savingProfile ? 'Speichert...' : 'Profil speichern' }}</button>
        <p v-if="profileMessage" class="form-success">{{ profileMessage }}</p>
      </form>

      <form class="profile-card form-grid" @submit.prevent="savePassword">
        <h2>Passwort ändern</h2>
        <div class="form-row"><label>Altes Passwort</label><input v-model="passwords.oldPassword" type="password"></div>
        <div class="form-row"><label>Neues Passwort</label><input v-model="passwords.newPassword" type="password"></div>
        <div class="form-row"><label>Neues Passwort wiederholen</label><input v-model="passwords.repeatPassword" type="password"></div>
        <button class="primary-pill" type="submit" :disabled="savingPassword">{{ savingPassword ? 'Speichert...' : 'Passwort ändern' }}</button>
        <p v-if="passwordMessage" class="form-success">{{ passwordMessage }}</p>
      </form>
    </section>
  </main>
</template>
