import { request } from './api.js'

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

export function updateMe(id, payload) {
  return request(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
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
