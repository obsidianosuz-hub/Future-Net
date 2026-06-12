import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Schedule {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  isAllDay: boolean
}

export interface Reminder {
  id: string
  title: string
  message?: string
  triggerTime: string
  isTriggered: boolean
  channel: 'SYSTEM' | 'TELEGRAM' | 'EMAIL'
  cronExpr?: string
}

export interface NewsArticle {
  title: string
  link: string
  snippet: string
  image?: string
}

export const usePersonalStore = defineStore('personal', () => {
  const schedules = ref<Schedule[]>([])
  const reminders = ref<Reminder[]>([])
  const newsFeed = ref<NewsArticle[]>([])
  const isLoading = ref(false)

  // Getters
  const upcomingSchedules = computed(() => {
    const now = new Date()
    return schedules.value
      .filter((s) => new Date(s.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  })

  const activeReminders = computed(() => {
    return reminders.value.filter((r) => !r.isTriggered)
  })

  // Actions
  const fetchSchedules = async () => {
    isLoading.value = true
    try {
      // Mock API fetch
      schedules.value = [
        {
          id: 'sched-1',
          title: 'Loyha Arxitekturasi Taqdimoti',
          description: 'Cyberpunk UI va Database schema taqdimoti',
          startTime: new Date(Date.now() + 3600000).toISOString(),
          endTime: new Date(Date.now() + 7200000).toISOString(),
          isAllDay: false
        },
        {
          id: 'sched-2',
          title: 'Daily Standup Meeting',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          endTime: new Date(Date.now() + 86400000 + 1800000).toISOString(),
          isAllDay: false
        }
      ]
    } catch (error) {
      console.error('Schedules loading failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addSchedule = async (newSchedule: Omit<Schedule, 'id'>) => {
    try {
      const schedule: Schedule = {
        ...newSchedule,
        id: Math.random().toString(36).substring(2, 9)
      }
      schedules.value.push(schedule)
      return { success: true, schedule }
    } catch (error) {
      return { success: false, message: 'Rejani saqlashda xatolik' }
    }
  }

  const fetchReminders = async () => {
    try {
      reminders.value = [
        {
          id: 'rem-1',
          title: 'Mijoz bilan bogʻlanish',
          message: 'CRM dagi top mijoz bilan 14 kunlik muddat tugadi',
          triggerTime: new Date(Date.now() + 600000).toISOString(),
          isTriggered: false,
          channel: 'TELEGRAM'
        }
      ]
    } catch (error) {
      console.error('Reminders fetching failed:', error)
    }
  }

  const telegramBotToken = ref(localStorage.getItem('fn_tg_token') || '')
  const telegramChatId = ref(localStorage.getItem('fn_tg_chat_id') || '')

  const setTelegramSettings = (token: string, chatId: string) => {
    telegramBotToken.value = token
    telegramChatId.value = chatId
    localStorage.setItem('fn_tg_token', token)
    localStorage.setItem('fn_tg_chat_id', chatId)
  }

  const addReminder = async (newReminder: Omit<Reminder, 'id' | 'isTriggered'>) => {
    try {
      const reminder: Reminder = {
        ...newReminder,
        id: Math.random().toString(36).substring(2, 9),
        isTriggered: false
      }
      reminders.value.unshift(reminder)
      
      // Redis & Cron simulyatsiyasi (setTimeout yordamida)
      const triggerTimeMs = new Date(reminder.triggerTime).getTime()
      const nowMs = Date.now()
      const delay = Math.max(0, triggerTimeMs - nowMs)

      setTimeout(async () => {
        const found = reminders.value.find(r => r.id === reminder.id)
        if (found) found.isTriggered = true

        // Real Telegram notification delivery
        if (reminder.channel === 'TELEGRAM' && telegramBotToken.value && telegramChatId.value) {
          try {
            const url = `https://api.telegram.org/bot${telegramBotToken.value}/sendMessage`
            const textMessage = `🔔 *FUTURE NET ESMATMA*:\n\n📌 *${reminder.title}*\n📝 ${reminder.message || ''}`
            
            await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: telegramChatId.value,
                text: textMessage,
                parse_mode: 'Markdown'
              })
            })
          } catch (err) {
            console.error('Telegram API error:', err)
          }
        }
      }, delay)

      return { success: true, reminder }
    } catch (error) {
      return { success: false }
    }
  }

  const searchNews = async (query: string) => {
    isLoading.value = true
    try {
      // Backend Google Custom Search API keshlangan endpointiga so'rov ketadi
      // Mocking results:
      newsFeed.value = [
        {
          title: 'AI and Cyberpunk technologies in 2026',
          link: 'https://futurenet.com/news/1',
          snippet: 'SaaS solutions are becoming glassmorphic and fully responsive.',
          image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5'
        },
        {
          title: 'NestJS and Vue 3 Pinia integration best practices',
          link: 'https://futurenet.com/news/2',
          snippet: 'Optimal patterns for enterprise web application state management.',
          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'
        }
      ]
    } catch (error) {
      console.error('News search failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    schedules,
    reminders,
    newsFeed,
    isLoading,
    telegramBotToken,
    telegramChatId,
    setTelegramSettings,
    upcomingSchedules,
    activeReminders,
    fetchSchedules,
    addSchedule,
    fetchReminders,
    addReminder,
    searchNews
  }
})
