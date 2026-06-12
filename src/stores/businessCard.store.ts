import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface SocialLink {
  platform: 'TELEGRAM' | 'FACEBOOK' | 'INSTAGRAM' | 'LINKEDIN'
  username: string
}

export interface BusinessCard {
  id: string
  companyName: string
  phone: string
  email?: string
  serviceType: string
  slug: string
  templateName: string
  socials: SocialLink[]
  qrCodeUrl?: string
  downloadCount: number
}

export const useBusinessCardStore = defineStore('businessCard', () => {
  const cards = ref<BusinessCard[]>([])
  const activeCard = ref<BusinessCard | null>(null)
  const isLoading = ref(false)

  // Actions
  const fetchCards = async () => {
    isLoading.value = true
    try {
      // Mock API
      cards.value = [
        {
          id: 'card-1',
          companyName: 'Future Net LLC',
          phone: '+998901234567',
          email: 'info@futurenet.uz',
          serviceType: 'IT Solutions',
          slug: 'futurenet-it',
          templateName: 'cyber-dark',
          socials: [
            { platform: 'TELEGRAM', username: 'futurenet_group' },
            { platform: 'FACEBOOK', username: 'futurenet.uz' }
          ],
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://futurenet.uz/v/futurenet-it',
          downloadCount: 42
        }
      ]
    } catch (error) {
      console.error('Failed to load business cards:', error)
    } finally {
      isLoading.value = false
    }
  }

  const createCard = async (cardData: Omit<BusinessCard, 'id' | 'downloadCount' | 'qrCodeUrl'>) => {
    isLoading.value = true
    try {
      // API request to create business card & auto generate QR code
      const newCard: BusinessCard = {
        ...cardData,
        id: Math.random().toString(36).substring(2, 9),
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://futurenet.uz/v/${cardData.slug}`,
        downloadCount: 0
      }
      cards.value.push(newCard)
      activeCard.value = newCard
      return { success: true, card: newCard }
    } catch (error) {
      return { success: false, message: 'Vizitka yaratishda xatolik yuz berdi' }
    } finally {
      isLoading.value = false
    }
  }

  const updateCard = async (id: string, cardData: Partial<BusinessCard>) => {
    isLoading.value = true
    try {
      const index = cards.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        cards.value[index] = { ...cards.value[index], ...cardData }
        if (cardData.slug) {
          cards.value[index].qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://futurenet.uz/v/${cardData.slug}`
        }
        if (activeCard.value?.id === id) {
          activeCard.value = cards.value[index]
        }
      }
      return { success: true }
    } catch (error) {
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  const recordQrDownload = async (id: string) => {
    try {
      const card = cards.value.find((c) => c.id === id)
      if (card) {
        card.downloadCount++
      }
    } catch (error) {
      console.error('QR download count tracking failed', error)
    }
  }

  return {
    cards,
    activeCard,
    isLoading,
    fetchCards,
    createCard,
    updateCard,
    recordQrDownload
  }
})
