import { request, API_BASE, authHeaders } from './api.js'

export function loginUser(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
}

export function registerUser(payload) {
  return request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export function requestPasswordReset(email) {
  return request('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
}

export function resetPassword(token, newPassword) {
  return request('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword })
  })
}

export function changePassword(oldPassword, newPassword) {
  return request('/api/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPassword, newPassword })
  })
}

export function updateMe(id, payload) {
  return request(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export async function uploadProfileImage(id, file) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch(`${API_BASE}/api/users/${id}/profile-image`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData
  })
  if (!response.ok) throw new Error('Profilbild konnte nicht hochgeladen werden.')
  return response.json()
}

export function deleteProfileImage(id) {
  return request(`/api/users/${id}/profile-image`, { method: 'DELETE' })
}

export function getUsers() {
  return request('/api/users')
}

export function updateUser(id, payload) {
  return request(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export function deleteUser(id) {
  return request(`/api/users/${id}`, { method: 'DELETE' })
}
