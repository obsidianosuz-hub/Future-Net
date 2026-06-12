import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface InAppNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
}

export interface ToastMessage {
  id: string
  text: string
  type: 'success' | 'info' | 'warning' | 'error'
  duration?: number
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<InAppNotification[]>([])
  const toasts = ref<ToastMessage[]>([])

  const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.isRead).length
  })

  // Add active toast (auto dismiss)
  const addToast = (text: string, type: ToastMessage['type'] = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9)
    toasts.value.push({ id, text, type, duration })
    
    setTimeout(() => {
      dismissToast(id)
    }, duration)
  }

  const dismissToast = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  // System notifications
  const addSystemNotification = (title: string, message: string, type: InAppNotification['type'] = 'info') => {
    const newNotif: InAppNotification = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    }
    notifications.value.unshift(newNotif)
    addToast(`${title}: ${message}`, type === 'error' ? 'error' : (type === 'warning' ? 'warning' : 'info'))
  }

  const markAllAsRead = () => {
    notifications.value.forEach((n) => (n.isRead = true))
  }

  return {
    notifications,
    toasts,
    unreadCount,
    addToast,
    dismissToast,
    addSystemNotification,
    markAllAsRead
  }
})
