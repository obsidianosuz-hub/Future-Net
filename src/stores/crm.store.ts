import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type RFMSegment = 'TOP' | 'CHURN_RISK' | 'PASSIVE'
export type DealStage = 'NEW' | 'NEGOTIATION' | 'PROPOSAL' | 'CONTRACT' | 'CLOSED_WON' | 'CLOSED_LOST'

export interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  rfmSegment: RFMSegment
  lastInteractionDate: string
  purchaseHistory: Array<{ date: string; amount: number; productName: string }>
}

export interface Deal {
  id: string
  contactId: string
  managerId: string
  title: string
  value: number
  stage: DealStage
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  assigneeId: string
  contactId?: string
  dueDate: string
  isCompleted: boolean
  isAutomated: boolean
}

export interface AdChannelStat {
  channelName: string
  cost: number
  leadsCount: number
  dealsCount: number
  revenue: number
}

export const useCRMStore = defineStore('crm', () => {
  const contacts = ref<Contact[]>([])
  const deals = ref<Deal[]>([])
  const tasks = ref<Task[]>([])
  const channelStats = ref<AdChannelStat[]>([])
  const isLoading = ref(false)

  // Getters
  const topContacts = computed(() => {
    return contacts.value.filter((c) => c.rfmSegment === 'TOP')
  })

  const churnRiskContacts = computed(() => {
    return contacts.value.filter((c) => c.rfmSegment === 'CHURN_RISK')
  })

  // Kanban guruhlash
  const dealsByStage = computed(() => {
    const stages: Record<DealStage, Deal[]> = {
      NEW: [],
      NEGOTIATION: [],
      PROPOSAL: [],
      CONTRACT: [],
      CLOSED_WON: [],
      CLOSED_LOST: []
    }
    deals.value.forEach((deal) => {
      if (stages[deal.stage]) {
        stages[deal.stage].push(deal)
      }
    })
    return stages
  })

  // Actions
  const fetchContacts = async () => {
    contacts.value = [
      {
        id: 'c-1',
        name: 'Jamshid Karimov',
        phone: '+998909876543',
        rfmSegment: 'TOP',
        lastInteractionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        purchaseHistory: [
          { date: '2026-05-20', amount: 1200000, productName: 'Cyberpunk Jacket' }
        ]
      },
      {
        id: 'c-2',
        name: 'Sobir Nosirov',
        phone: '+998935552211',
        rfmSegment: 'CHURN_RISK',
        // 15 kun avval bog'lanilgan, ogohlantirishga tushadi
        lastInteractionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        purchaseHistory: []
      }
    ]
    checkInactivityAndCreateTasks()
  }

  const fetchDeals = async () => {
    deals.value = [
      {
        id: 'deal-1',
        contactId: 'c-1',
        managerId: 'user-uuid-1',
        title: 'ERP hamkorlik shartnomasi',
        value: 45000000,
        stage: 'NEGOTIATION',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }

  // 14 kunlik harakatsizlikni tekshirib avtomat vazifa ochish
  const checkInactivityAndCreateTasks = () => {
    const now = new Date().getTime()
    const limit = 14 * 24 * 60 * 60 * 1000

    contacts.value.forEach((contact) => {
      const lastDate = new Date(contact.lastInteractionDate).getTime()
      if (now - lastDate > limit) {
        // Avtomat vazifa allaqachon mavjudligini tekshirish
        const taskExists = tasks.value.some((t) => t.contactId === contact.id && t.isAutomated && !t.isCompleted)
        if (!taskExists) {
          tasks.value.push({
            id: Math.random().toString(36).substring(2, 9),
            title: `Mijoz bilan aloqa yo'q: ${contact.name}`,
            description: `Oxirgi muloqotdan buyon 14 kundan oshdi. Iltimos bogʻlaning.`,
            assigneeId: 'user-uuid-1', // Mas'ul menejer
            contactId: contact.id,
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            isCompleted: false,
            isAutomated: true
          })
        }
      }
    })
  }

  // Kanban bitim bosqichini o'zgartirish va avtomat vazifa ochish
  const updateDealStage = async (dealId: string, newStage: DealStage) => {
    const deal = deals.value.find((d) => d.id === dealId)
    if (deal) {
      const oldStage = deal.stage
      deal.stage = newStage
      deal.updatedAt = new Date().toISOString()

      // Bitim bosqichi shartnomaga o'tganda avtomat vazifa yaratish
      if (newStage === 'CONTRACT' && oldStage !== 'CONTRACT') {
        tasks.value.push({
          id: Math.random().toString(36).substring(2, 9),
          title: `Shartnoma tayyorlash: ${deal.title}`,
          description: `Bitim bosqichi oʻzgardi. Shartnomani rasmiylashtiring.`,
          assigneeId: deal.managerId,
          contactId: deal.contactId,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          isCompleted: false,
          isAutomated: true
        })
      }
    }
  }

  const fetchAdAnalytics = async () => {
    channelStats.value = [
      { channelName: 'Google Ads', cost: 5000000, leadsCount: 120, dealsCount: 15, revenue: 18000000 },
      { channelName: 'Telegram Channels', cost: 2000000, leadsCount: 95, dealsCount: 22, revenue: 26000000 }
    ]
  }

  return {
    contacts,
    deals,
    tasks,
    channelStats,
    isLoading,
    topContacts,
    churnRiskContacts,
    dealsByStage,
    fetchContacts,
    fetchDeals,
    updateDealStage,
    fetchAdAnalytics
  }
})
