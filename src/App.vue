<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GlassCard from './components/ui/GlassCard.vue'

// Import Pinia Stores
import { useAuthStore } from './stores/auth.store'
import { usePersonalStore } from './stores/personal.store'
import { useBusinessCardStore } from './stores/businessCard.store'
import { useEducationStore } from './stores/education.store'
import { useRestaurantStore } from './stores/restaurant.store'
import { useSalesStore } from './stores/sales.store'
import { useCRMStore } from './stores/crm.store'
import { useNotificationStore } from './stores/notification.store'

// Instantiate Stores
const authStore = useAuthStore()
const personalStore = usePersonalStore()
const cardStore = useBusinessCardStore()
const eduStore = useEducationStore()
const restStore = useRestaurantStore()
const salesStore = useSalesStore()
const crmStore = useCRMStore()
const notifStore = useNotificationStore()

// State
const activeTab = ref('personal') // personal | bcard | education | restaurant | sales | crm
const newScheduleTitle = ref('')
const newReminderTitle = ref('')
const simulatedBarcode = ref('4780012345678')

// Personal Calendar State
const selectedDate = ref<Date>(new Date())
const newScheduleTime = ref('09:00')

const monthNamesUz = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
]

const dayNamesUz = [
  { short: 'Ya', full: 'Yakshanba' },
  { short: 'Du', full: 'Dushanba' },
  { short: 'Se', full: 'Seshanba' },
  { short: 'Ch', full: 'Chorshanba' },
  { short: 'Pa', full: 'Payshanba' },
  { short: 'Ju', full: 'Juma' },
  { short: 'Sha', full: 'Shanba' }
]

// Hozirgi haftadagi kunlarni aniqlash (Dushanba - Yakshanba)
const currentWeekDays = computed(() => {
  const current = new Date(selectedDate.value)
  const day = current.getDay()
  const distanceToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(current)
  monday.setDate(current.getDate() + distanceToMonday)

  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const formatted = d.toISOString().split('T')[0]
    
    const hasPlans = personalStore.schedules.some((s) => {
      const scheduleDate = new Date(s.startTime).toISOString().split('T')[0]
      return scheduleDate === formatted
    })

    const dayIndex = d.getDay()
    days.push({
      name: dayNamesUz[dayIndex].short,
      fullName: dayNamesUz[dayIndex].full,
      date: d,
      dayNumber: d.getDate(),
      formattedDate: formatted,
      hasPlans
    })
  }
  return days
})

// Hozirgi tanlangan oy va yil nomi
const currentMonthYear = computed(() => {
  const m = selectedDate.value.getMonth()
  const y = selectedDate.value.getFullYear()
  return `${monthNamesUz[m]}, ${y}`
})

// Tanlangan kunga tegishli rejalar
const filteredSchedules = computed(() => {
  const formattedSelected = selectedDate.value.toISOString().split('T')[0]
  return personalStore.schedules.filter((s) => {
    const scheduleDate = new Date(s.startTime).toISOString().split('T')[0]
    return scheduleDate === formattedSelected
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
})

const handleSelectDay = (date: Date) => {
  selectedDate.value = date
}

const changeWeek = (direction: 'prev' | 'next') => {
  const current = new Date(selectedDate.value)
  const offset = direction === 'next' ? 7 : -7
  current.setDate(current.getDate() + offset)
  selectedDate.value = current
}

// Card Builder Temporary State
const cardCompany = ref('Future Net Corp')
const cardPhone = ref('+998991112233')
const cardService = ref('Enterprise Cloud Integration')
const cardSlug = ref('future-net-corp')

// Restaurant Expense Form State
const expAmount = ref(150000)
const expDesc = ref('Mahsulot yetkazib berish haqi')

onMounted(() => {
  // Initialize Mock Data
  authStore.login('admin@futurenet.uz', 'secret')
  personalStore.fetchSchedules()
  personalStore.fetchReminders()
  cardStore.fetchCards()
  eduStore.fetchCourses()
  restStore.initTables()
  restStore.fetchMenu()
  salesStore.fetchProducts()
  crmStore.fetchContacts()
  crmStore.fetchDeals()
  crmStore.fetchAdAnalytics()

  // Add startup notifications
  notifStore.addSystemNotification('Tizim yuklandi', 'Cyberpunk Glassmorphism poydevori ishga tushirildi.', 'success')
})

// Simulated Actions
const handleAddSchedule = async () => {
  if (!newScheduleTitle.value) return
  
  const dateStr = selectedDate.value.toISOString().split('T')[0]
  const combinedDateTimeStr = `${dateStr}T${newScheduleTime.value}:00`
  const startTime = new Date(combinedDateTimeStr).toISOString()
  const endTime = new Date(new Date(startTime).getTime() + 3600000).toISOString()
  
  await personalStore.addSchedule({
    title: newScheduleTitle.value,
    startTime,
    endTime,
    isAllDay: false
  })
  
  notifStore.addToast('Yangi reja yaratildi', 'success')
  newScheduleTitle.value = ''
}

const handleAddReminder = async () => {
  if (!newReminderTitle.value) return
  await personalStore.addReminder({
    title: newReminderTitle.value,
    message: 'Redis va Cron yordamida eslatma yuborildi',
    triggerTime: new Date(Date.now() + 5000).toISOString(),
    channel: 'SYSTEM'
  })
  notifStore.addSystemNotification('Eslatma oʻrnatildi', newReminderTitle.value, 'info')
  newReminderTitle.value = ''
}

const handleCreateCard = async () => {
  await cardStore.createCard({
    companyName: cardCompany.value,
    phone: cardPhone.value,
    serviceType: cardService.value,
    slug: cardSlug.value,
    templateName: 'cyber-dark',
    socials: [
      { platform: 'TELEGRAM', username: cardSlug.value },
      { platform: 'FACEBOOK', username: cardSlug.value }
    ]
  })
  notifStore.addToast('Raqamli Vizitka yaratildi!', 'success')
}

const handleLessonComplete = (lessonId: string, courseId: string) => {
  eduStore.completeLesson(lessonId, courseId)
  notifStore.addToast('+50 XP olindi!', 'success')
}

const toggleTableStatus = (tableNo: number) => {
  const table = restStore.tables.find(t => t.tableNo === tableNo)
  if (!table) return
  
  let newStatus: any = 'VACANT'
  let bill = 0
  let time = undefined

  if (table.status === 'VACANT') {
    newStatus = 'OCCUPIED'
    bill = 125000
    time = new Date().toLocaleTimeString()
  } else if (table.status === 'OCCUPIED') {
    newStatus = 'PAYMENT_PENDING'
    bill = table.totalBill
    time = table.orderTime
  } else {
    newStatus = 'VACANT'
  }

  restStore.updateTableStatusFromSocket({
    tableNo,
    status: newStatus,
    bill,
    orderTime: time
  })

  notifStore.addToast(`Stol-${tableNo} statusi oʻzgardi`, 'info')
}

const handleAddExpense = async () => {
  const res = await restStore.addExpense({
    amount: expAmount.value,
    description: expDesc.value,
    expenseDate: new Date().toISOString(),
    categoryId: 'exp-cat-1'
  })
  if (res.success) {
    notifStore.addToast('Xarajat muvaffaqiyatli qoʻshildi', 'success')
  }
}

const handleScanBarcode = () => {
  const res = salesStore.scanBarcode(simulatedBarcode.value)
  if (res.found && res.product) {
    notifStore.addToast(`Skanerlandi: ${res.product.name}`, 'success')
    // Skanerlanganda sotuv jarayonini boshlash
    salesStore.createSalesOrder(
      {
        customerId: 'cust-1',
        customerName: 'Skanerlangan Xaridor',
        totalAmount: res.product.price,
        channel: 'WEB',
        shippingAddress: 'Toshkent shahar'
      },
      [{ productId: res.product.id, quantity: 1 }]
    )
  } else {
    notifStore.addToast('Mahsulot topilmadi', 'error')
  }
}

const handleDealStageChange = (dealId: string, stage: any) => {
  crmStore.updateDealStage(dealId, stage)
  notifStore.addSystemNotification('CRM Voronkasi', `Bitim bosqichi oʻzgartirildi: ${stage}`, 'info')
}
</script>

<template>
  <div class="min-h-screen bg-[#030008] text-slate-100 font-sans relative cyber-scanline">
    <!-- Grid Overlay Background -->
    <div class="absolute inset-0 cyber-grid-overlay opacity-15 pointer-events-none z-0" />

    <!-- Ambient glows -->
    <div class="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyber-purple/10 rounded-full blur-[150px] pointer-events-none z-0" />
    <div class="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-cyber-cyan/5 rounded-full blur-[180px] pointer-events-none z-0" />

    <!-- Global Toast stack -->
    <div class="fixed top-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
      <div 
        v-for="t in notifStore.toasts" 
        :key="t.id"
        :class="[
          'px-4 py-3 rounded-lg backdrop-blur-md border shadow-lg flex items-center justify-between gap-3 transition-all duration-300 transform translate-x-0',
          t.type === 'success' ? 'bg-emerald-950/80 border-cyber-emerald/40 text-cyber-emerald' : 
          t.type === 'error' ? 'bg-pink-950/80 border-cyber-pink/40 text-cyber-pink' :
          'bg-cyan-950/80 border-cyber-cyan/40 text-cyber-cyan'
        ]"
      >
        <span>{{ t.text }}</span>
        <button @click="notifStore.dismissToast(t.id)" class="text-xs hover:opacity-75">✕</button>
      </div>
    </div>

    <!-- Header Section -->
    <header class="border-b border-cyber-purple/20 backdrop-blur-md bg-black/40 relative z-10">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink font-outfit">
            FUTURE NET
          </span>
          <span class="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-cyber-cyan/40 text-cyber-cyan bg-cyan-950/30">
            Enterprise SaaS
          </span>
        </div>

        <!-- Role & Feature Access Switchers -->
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-xs text-slate-400">Tizim Foydalanuvchisi</p>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></span>
              <p class="text-sm font-semibold text-cyber-cyan">{{ authStore.user?.role.name || 'Ultra Admin' }}</p>
            </div>
          </div>
          <div class="border-l border-slate-800 h-8"></div>
          
          <!-- System Notifications Indicator -->
          <div class="relative cursor-pointer" @click="notifStore.markAllAsRead">
            <span class="text-xl">🔔</span>
            <span v-if="notifStore.unreadCount > 0" class="absolute -top-1 -right-1 bg-cyber-pink text-white text-[9px] px-1 rounded-full animate-bounce">
              {{ notifStore.unreadCount }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="max-w-7xl mx-auto px-6 py-8 relative z-10">
      
      <!-- Module Selector Bar -->
      <div class="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
        <button 
          v-for="tab in [
            { id: 'personal', label: '1. Personal', color: 'cyan', icon: '📅' },
            { id: 'bcard', label: '2. Card Builder', color: 'purple', icon: '🪪' },
            { id: 'education', label: '3. Education', color: 'emerald', icon: '🎓' },
            { id: 'restaurant', label: '4. Restaurant', color: 'pink', icon: '🍽️' },
            { id: 'sales', label: '5. Sales POS', color: 'cyan', icon: '🛒' },
            { id: 'crm', label: '6. CRM Pipeline', color: 'purple', icon: '💼' }
          ]"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-3 rounded-xl border text-left flex items-center gap-2 transition-all duration-300 font-outfit uppercase tracking-wider text-xs',
            activeTab === tab.id 
              ? `border-cyber-${tab.color} bg-cyber-${tab.color}/10 shadow-neon-${tab.color} text-white` 
              : 'border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10 hover:text-white'
          ]"
        >
          <span>{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Module Views -->
      <div class="transition-all duration-300">

        <!-- 1. PERSONAL SECTION -->
        <div v-if="activeTab === 'personal'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 flex flex-col gap-6">
            <GlassCard variant="cyan" :neon-glow="true">
              <h2 class="text-xl font-bold font-outfit mb-4 text-cyber-cyan flex items-center gap-2">
                <span>📅</span> Shaxsiy Taym-Menejment
              </h2>

              <!-- Calendar Month & Navigation -->
              <div class="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <button 
                  @click="changeWeek('prev')" 
                  class="px-3 py-1 rounded bg-white/5 border border-white/10 hover:border-cyber-cyan/50 text-slate-300 text-xs font-mono transition"
                >
                  ◀ Oʻtgan hafta
                </button>
                <h3 class="text-base font-bold font-outfit text-cyber-cyan tracking-wider uppercase">
                  {{ currentMonthYear }}
                </h3>
                <button 
                  @click="changeWeek('next')" 
                  class="px-3 py-1 rounded bg-white/5 border border-white/10 hover:border-cyber-cyan/50 text-slate-300 text-xs font-mono transition"
                >
                  Keyingi hafta ▶
                </button>
              </div>

              <!-- Weekly Days Grid -->
              <div class="grid grid-cols-7 gap-2 mb-6">
                <div 
                  v-for="day in currentWeekDays" 
                  :key="day.formattedDate"
                  @click="handleSelectDay(day.date)"
                  :class="[
                    'p-3 text-center rounded-xl border cursor-pointer transition-all duration-300 relative',
                    selectedDate.toISOString().split('T')[0] === day.formattedDate
                      ? 'border-cyber-cyan bg-cyber-cyan/15 shadow-neon-cyan' 
                      : 'border-white/5 bg-white/[0.01] hover:border-white/15'
                  ]"
                >
                  <span class="text-[10px] uppercase font-mono text-slate-400 block mb-1">{{ day.name }}</span>
                  <span class="text-lg font-extrabold block text-white">{{ day.dayNumber }}</span>
                  
                  <!-- Indicator dot if there are plans on this day -->
                  <span 
                    v-if="day.hasPlans" 
                    class="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00f0ff] animate-pulse"
                  />
                </div>
              </div>

              <!-- Schedules for Selected Day -->
              <div class="space-y-4">
                <h3 class="text-xs uppercase font-mono tracking-wider text-slate-400 border-b border-white/5 pb-2">
                  Kunlik Rejalar: <span class="text-cyber-cyan">{{ selectedDate.getDate() }}-{{ monthNamesUz[selectedDate.getMonth()] }}</span>
                </h3>

                <div v-if="filteredSchedules.length > 0" class="space-y-3">
                  <div 
                    v-for="s in filteredSchedules" 
                    :key="s.id" 
                    class="p-4 rounded-xl border border-cyber-cyan/20 bg-cyan-950/15 flex items-center justify-between"
                  >
                    <div>
                      <h4 class="font-bold text-white text-sm">{{ s.title }}</h4>
                      <p class="text-xs text-slate-400 mt-1">{{ s.description || 'Tavsif berilmagan' }}</p>
                    </div>
                    <div class="text-right">
                      <span class="text-xs px-2 py-0.5 rounded bg-cyan-900/40 border border-cyber-cyan/30 text-cyber-cyan font-mono">
                        {{ new Date(s.startTime).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) }}
                      </span>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-6 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                  <p class="text-xs text-slate-500">Ushbu kunga hech qanday reja kiritilmagan.</p>
                </div>
              </div>

              <!-- Create Schedule Form -->
              <div class="mt-6 border-t border-white/5 pt-4">
                <label class="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                  Yangi Reja Qoʻshish (Kop kun: {{ selectedDate.getDate() }}-{{ monthNamesUz[selectedDate.getMonth()] }})
                </label>
                <div class="flex gap-2 flex-wrap sm:flex-nowrap">
                  <input 
                    v-model="newScheduleTitle"
                    type="text" 
                    placeholder="Reja mazmuni (Masalan: NestJS meeting)"
                    class="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan flex-1 min-w-[200px]"
                  />
                  
                  <!-- Time Picker input -->
                  <input 
                    v-model="newScheduleTime"
                    type="time" 
                    class="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan w-32"
                  />

                  <button 
                    @click="handleAddSchedule" 
                    class="px-4 py-2 rounded-xl bg-cyber-cyan text-black font-semibold text-sm hover:opacity-90 transition w-full sm:w-auto shrink-0"
                  >
                    Rejalashtirish
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>

          <div class="flex flex-col gap-6">
            <!-- Smart Reminders -->
            <GlassCard variant="default">
              <h2 class="text-lg font-bold font-outfit mb-4 text-slate-200">
                🔔 Smart Reminder
              </h2>
              <div class="space-y-3">
                <div v-for="r in personalStore.reminders" :key="r.id" class="p-3 rounded-lg border border-white/5 bg-white/[0.01] flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-white">{{ r.title }}</h4>
                    <p class="text-xs text-slate-500 mt-0.5">Kanal: {{ r.channel }}</p>
                  </div>
                  <span class="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></span>
                </div>
              </div>

              <div class="mt-4 border-t border-white/5 pt-4">
                <div class="flex gap-2">
                  <input 
                    v-model="newReminderTitle"
                    type="text" 
                    placeholder="Telegramga eslatma"
                    class="bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-cyan flex-1"
                  />
                  <button @click="handleAddReminder" class="px-3 py-1.5 rounded-xl border border-cyber-cyan/30 text-cyber-cyan text-xs hover:bg-cyber-cyan/10">
                    Aktivlashtirish
                  </button>
                </div>
              </div>
            </GlassCard>

            <!-- News Feed -->
            <GlassCard variant="default">
              <h2 class="text-lg font-bold font-outfit mb-3 text-slate-200 flex items-center justify-between">
                <span>📰 Latest News</span>
                <span class="text-[10px] text-cyber-cyan bg-cyan-950 px-2 py-0.5 rounded">Google API</span>
              </h2>
              <div class="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                <div v-for="n in personalStore.newsFeed" :key="n.title" class="p-2 rounded bg-white/[0.02] hover:bg-white/[0.04]">
                  <a :href="n.link" target="_blank" class="text-xs font-semibold text-cyber-cyan hover:underline line-clamp-1">
                    {{ n.title }}
                  </a>
                  <p class="text-[11px] text-slate-400 mt-1 line-clamp-2">{{ n.snippet }}</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        <!-- 2. BUSINESS CARD CONSTRUCTOR -->
        <div v-if="activeTab === 'bcard'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Card Builder Form -->
          <GlassCard variant="purple">
            <h2 class="text-xl font-bold font-outfit mb-4 text-cyber-purple">
              🪪 Vizitka Konstruktori (Builder)
            </h2>
            <div class="space-y-4">
              <div>
                <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1">Kompaniya nomi</label>
                <input v-model="cardCompany" type="text" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1">Telefon raqam</label>
                <input v-model="cardPhone" type="text" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1">Xizmat turi</label>
                <input v-model="cardService" type="text" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1">Slug (URL uchun)</label>
                <input v-model="cardSlug" type="text" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              </div>
              
              <button @click="handleCreateCard" class="w-full py-2.5 rounded-lg bg-cyber-purple text-white font-bold hover:opacity-90 transition">
                Yaratish va QR Generator
              </button>
            </div>
          </GlassCard>

          <!-- Vizitka Preview (Mobile-First) -->
          <div class="flex flex-col items-center justify-center p-6 border border-white/5 rounded-2xl bg-black/50 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-3 text-[10px] text-cyber-purple bg-purple-950/20 border-b border-l border-cyber-purple/20 rounded-bl-xl">
              QR Auto-Generated
            </div>
            
            <!-- Mobile Preview Frame -->
            <div class="w-[300px] h-[550px] rounded-[36px] border-[6px] border-slate-800 bg-slate-950 shadow-2xl relative overflow-hidden flex flex-col justify-between p-6">
              <div class="text-center mt-6">
                <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-cyber-cyan to-cyber-purple mx-auto flex items-center justify-center text-2xl font-bold shadow-neon-purple">
                  FN
                </div>
                <h3 class="mt-4 font-bold text-white text-lg tracking-wide">{{ cardCompany }}</h3>
                <span class="text-xs px-2 py-0.5 rounded-full bg-purple-950/50 text-cyber-purple border border-cyber-purple/20">
                  {{ cardService }}
                </span>
              </div>

              <!-- QR Code Card Box -->
              <div class="bg-black/60 border border-white/10 p-4 rounded-xl text-center my-4">
                <p class="text-[9px] uppercase tracking-wider text-slate-400 mb-2">QR skanerlash</p>
                <img 
                  :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://futurenet.uz/v/${cardSlug}`"
                  class="w-32 h-32 mx-auto rounded border border-white/20 p-1 bg-white" 
                  alt="QR Code"
                />
                <button 
                  @click="cardStore.recordQrDownload('card-1')"
                  class="mt-3 text-[10px] px-3 py-1 rounded bg-cyber-purple/20 hover:bg-cyber-purple/40 text-cyber-purple border border-cyber-purple/30 w-full transition"
                >
                  QR Yuklash (Download)
                </button>
              </div>

              <div class="text-center text-[10px] text-slate-500 mb-4">
                <p>Tel: {{ cardPhone }}</p>
                <p class="mt-1">Telegram: @{{ cardSlug }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. EDUCATION MODULI -->
        <div v-if="activeTab === 'education'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 flex flex-col gap-6">
            <GlassCard variant="emerald">
              <h2 class="text-xl font-bold font-outfit mb-4 text-cyber-emerald flex items-center justify-between">
                <span>🎓 Kurslar va Darslar</span>
                <span class="text-xs font-normal text-slate-400">Fanlar limiti yo'q</span>
              </h2>

              <div class="space-y-6">
                <div v-for="c in eduStore.courses" :key="c.id" class="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <div class="flex justify-between items-start mb-3">
                    <h3 class="text-lg font-bold text-white">{{ c.title }}</h3>
                    <span class="text-xs font-mono text-cyber-emerald">{{ eduStore.courseProgress(c.id) }}% bajarildi</span>
                  </div>
                  
                  <!-- Progress Bar -->
                  <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-4">
                    <div 
                      class="bg-cyber-emerald h-full transition-all duration-500" 
                      :style="{ width: eduStore.courseProgress(c.id) + '%' }"
                    />
                  </div>

                  <!-- Lessons list -->
                  <div class="space-y-2">
                    <div 
                      v-for="l in c.lessons" 
                      :key="l.id" 
                      class="flex items-center justify-between p-3 rounded bg-black/40 border border-white/5 hover:border-cyber-emerald/30 transition text-sm"
                    >
                      <div class="flex items-center gap-2">
                        <span class="text-xs text-slate-500">#{{ l.orderIndex }}</span>
                        <span>{{ l.title }}</span>
                      </div>
                      <button 
                        @click="handleLessonComplete(l.id, c.id)"
                        :class="[
                          'text-xs px-2.5 py-1 rounded transition',
                          eduStore.studentProfile.completedLessonIds.includes(l.id)
                            ? 'bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30'
                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                        ]"
                      >
                        {{ eduStore.studentProfile.completedLessonIds.includes(l.id) ? 'Koʻrilgan ✔' : 'Koʻrish' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          <div class="flex flex-col gap-6">
            <!-- Student Profile & Achievements -->
            <GlassCard variant="default">
              <h2 class="text-lg font-bold font-outfit mb-4 text-slate-200">
                👤 Student Profile & Gamification
              </h2>
              
              <div class="text-center py-4 border-b border-white/5">
                <div class="w-20 h-20 rounded-full border-2 border-cyber-emerald mx-auto flex items-center justify-center text-4xl font-extrabold text-cyber-emerald shadow-neon-emerald">
                  {{ eduStore.currentLevel }}
                </div>
                <h3 class="mt-3 font-bold text-white text-lg">Talaba Profili</h3>
                <p class="text-sm text-slate-400 mt-1">Level: {{ eduStore.currentLevel }} | {{ eduStore.totalXp }} XP</p>
              </div>

              <!-- Quizzes / Games -->
              <div class="mt-4">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Interaktiv Viktorina (Quiz)</h4>
                <div class="p-3 rounded-xl bg-emerald-950/20 border border-cyber-emerald/20 text-center">
                  <p class="text-sm text-white font-medium">Vue 3 Pinia sinov testi</p>
                  <p class="text-xs text-slate-400 mt-1">Muvaffaqiyatli topshirganingiz uchun +100 XP</p>
                  <button 
                    @click="eduStore.submitQuizAnswers('quiz-1', 90).then(res => { if(res.passed) notifStore.addToast('Quiz topshirildi! +100 XP', 'success') })" 
                    class="mt-3 w-full py-1.5 rounded bg-cyber-emerald text-black font-bold text-xs hover:opacity-90"
                  >
                    Testni Topsirish
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        <!-- 4. SMART RESTAURANT -->
        <div v-if="activeTab === 'restaurant'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 flex flex-col gap-6">
            <GlassCard variant="pink">
              <h2 class="text-xl font-bold font-outfit mb-4 text-cyber-pink flex items-center justify-between">
                <span>🍽️ 12 ta Stol real-vaqt buyurtmalar paneli</span>
                <span class="text-xs px-2.5 py-0.5 rounded bg-pink-950 border border-cyber-pink/30 text-cyber-pink animate-pulse">Websockets</span>
              </h2>

              <!-- 12 Tables Grid -->
              <div class="grid grid-cols-3 sm:grid-cols-4 gap-4">
                <div 
                  v-for="t in restStore.tables" 
                  :key="t.id"
                  @click="toggleTableStatus(t.tableNo)"
                  :class="[
                    'p-4 rounded-xl border transition cursor-pointer text-center relative overflow-hidden',
                    t.status === 'VACANT' ? 'border-white/10 bg-white/[0.02] hover:border-white/30' :
                    t.status === 'OCCUPIED' ? 'border-cyber-pink bg-cyber-pink/15 shadow-neon-pink' :
                    'border-cyber-cyan bg-cyber-cyan/15 shadow-neon-cyan'
                  ]"
                >
                  <p class="text-sm font-bold text-white">Stol {{ t.tableNo }}</p>
                  <p class="text-[10px] text-slate-400 mt-1 uppercase">{{ t.status }}</p>
                  <p v-if="t.totalBill > 0" class="text-xs text-cyber-pink font-semibold mt-2">
                    {{ t.totalBill.toLocaleString() }} UZS
                  </p>
                  <p v-if="t.orderTime" class="text-[9px] text-slate-500 mt-1">⏰ {{ t.orderTime }}</p>
                </div>
              </div>
            </GlassCard>

            <!-- Finance Statistics -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <h4 class="text-xs uppercase text-slate-400 font-medium">Kunlik Tushum</h4>
                <p class="text-xl font-bold text-cyber-pink mt-2">{{ restStore.totalIncome.toLocaleString() }} UZS</p>
              </div>
              <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <h4 class="text-xs uppercase text-slate-400 font-medium">Xarajatlar</h4>
                <p class="text-xl font-bold text-slate-200 mt-2">{{ restStore.totalExpenses.toLocaleString() }} UZS</p>
              </div>
              <div class="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <h4 class="text-xs uppercase text-slate-400 font-medium">Sof Foyda</h4>
                <p class="text-xl font-bold text-cyber-cyan mt-2">{{ restStore.netProfit.toLocaleString() }} UZS</p>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-6">
            <!-- Restaurant Inventory/Warehouse -->
            <GlassCard variant="default">
              <h2 class="text-lg font-bold font-outfit mb-3 text-slate-200">
                📦 Omborxona & Zaxira
              </h2>
              <p class="text-xs text-slate-400 mb-4">Minimum qoldiqdan kamaygan ogohlantirishlar</p>

              <div class="p-3 rounded-lg border border-cyber-pink/20 bg-pink-950/10 mb-4 flex items-center justify-between">
                <div>
                  <h4 class="text-xs font-bold text-cyber-pink uppercase">Zaxira Kamaygan Ogohlantirish</h4>
                  <p class="text-sm text-slate-200 mt-1">Goʻsht zaxirasi: 3 kg qoldi! (Min: 5 kg)</p>
                </div>
                <span class="w-2 h-2 rounded-full bg-cyber-pink animate-ping"></span>
              </div>

              <!-- Add Expense Form (Description, amount, category, date mandatory) -->
              <div class="border-t border-white/5 pt-4">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Moliyaviy Xarajat Kiritish</h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-[10px] text-slate-400 mb-1">Xarajat Tavsifi (Majburiy)</label>
                    <input v-model="expDesc" type="text" class="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1 text-xs" />
                  </div>
                  <div>
                    <label class="block text-[10px] text-slate-400 mb-1">Summa (Majburiy)</label>
                    <input v-model="expAmount" type="number" class="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1 text-xs" />
                  </div>
                  <button @click="handleAddExpense" class="w-full py-2 rounded bg-cyber-pink text-black font-bold text-xs hover:opacity-90">
                    Xarajat Yozish
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        <!-- 5. SMART SALES -->
        <div v-if="activeTab === 'sales'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 flex flex-col gap-6">
            <GlassCard variant="cyan">
              <h2 class="text-xl font-bold font-outfit mb-4 text-cyber-cyan">
                🛒 Smart Sales POS Terminal & Onlayn Magazin
              </h2>

              <!-- Barcode scan simulator -->
              <div class="p-4 rounded-xl bg-black/40 border border-white/5 mb-6 flex gap-4 items-end">
                <div class="flex-1">
                  <label class="block text-xs uppercase tracking-wider text-slate-400 mb-2">Shtrix-kod Skaner Simulyatori</label>
                  <input v-model="simulatedBarcode" type="text" class="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <button @click="handleScanBarcode" class="px-4 py-2 rounded-lg bg-cyber-cyan text-black font-semibold text-sm hover:opacity-95">
                  Skanerlash
                </button>
              </div>

              <!-- Product List -->
              <h3 class="text-sm font-bold uppercase text-slate-400 mb-3">Ombor qoldig'i (Sotilganda avtomat kamayish)</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="p in salesStore.products" :key="p.id" class="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <div class="flex justify-between items-start">
                    <h4 class="font-bold text-white">{{ p.name }}</h4>
                    <span :class="[
                      'text-[10px] px-2 py-0.5 rounded font-mono',
                      p.stockQty <= p.minStockQty ? 'bg-pink-950 text-cyber-pink border border-cyber-pink/30 animate-pulse' : 'bg-cyan-950 text-cyber-cyan border border-cyber-cyan/30'
                    ]">
                      Zaxira: {{ p.stockQty }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-400 mt-1">Shtrix-kod: {{ p.barcode || 'Yoʻq' }}</p>
                  <p class="text-sm font-semibold text-cyber-cyan mt-3">{{ p.price.toLocaleString() }} UZS</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <div class="flex flex-col gap-6">
            <!-- Delivery Status & Installments -->
            <GlassCard variant="default">
              <h2 class="text-lg font-bold font-outfit mb-4 text-slate-200">
                📦 Muddatli Toʻlov & Yetkazish
              </h2>
              
              <div class="p-3 rounded-lg border border-white/5 bg-white/[0.01] mb-4">
                <h4 class="text-xs font-bold uppercase text-slate-400">Buyurtma Statuslar Zanjiri</h4>
                <div class="flex items-center justify-between mt-3 text-[10px] font-mono">
                  <span class="text-cyber-cyan">Received</span>
                  <span class="text-slate-600">→</span>
                  <span class="text-slate-400">Packing</span>
                  <span class="text-slate-600">→</span>
                  <span class="text-slate-400">On Way</span>
                  <span class="text-slate-600">→</span>
                  <span class="text-slate-400">Delivered</span>
                </div>
              </div>

              <!-- Installments list -->
              <div class="p-3 rounded-lg bg-cyan-950/15 border border-cyber-cyan/25">
                <h4 class="text-xs font-bold text-cyber-cyan uppercase">Rassrochka moduli (Click/Payme)</h4>
                <p class="text-sm text-white mt-1">Click/Payme orqali 3 xil: naqd, karta va mixed to'lovlar xavfsiz qabul qilinadi.</p>
              </div>
            </GlassCard>
          </div>
        </div>

        <!-- 6. CRM PIPELINE -->
        <div v-if="activeTab === 'crm'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 flex flex-col gap-6">
            <GlassCard variant="purple">
              <h2 class="text-xl font-bold font-outfit mb-4 text-cyber-purple flex items-center justify-between">
                <span>💼 CRM Kanban Pipeline (Voronka)</span>
                <span class="text-xs text-slate-400 font-normal">Bitim qiymati va menejer bogʻliqligi</span>
              </h2>

              <!-- Kanban Columns -->
              <div class="grid grid-cols-3 gap-3">
                <div v-for="stage in ['NEW', 'NEGOTIATION', 'CONTRACT']" :key="stage" class="p-3 rounded-xl bg-black/40 border border-white/5">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center border-b border-white/5 pb-2">
                    {{ stage }}
                  </h3>
                  
                  <div class="space-y-3">
                    <div 
                      v-for="d in crmStore.dealsByStage[stage as any]" 
                      :key="d.id"
                      class="p-3 rounded-lg bg-purple-950/10 border border-cyber-purple/20 relative"
                    >
                      <h4 class="text-xs font-bold text-white">{{ d.title }}</h4>
                      <p class="text-[11px] font-semibold text-cyber-purple mt-2">{{ d.value.toLocaleString() }} UZS</p>
                      
                      <!-- Simulated actions -->
                      <div class="flex gap-1 mt-3 justify-end">
                        <button 
                          v-if="stage === 'NEGOTIATION'"
                          @click="handleDealStageChange(d.id, 'CONTRACT')"
                          class="text-[9px] px-2 py-0.5 rounded bg-cyber-purple text-white font-bold"
                        >
                          Shartnomaga oʻtkazish
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          <div class="flex flex-col gap-6">
            <!-- Contact Card & RFM Segment -->
            <GlassCard variant="default">
              <h2 class="text-lg font-bold font-outfit mb-4 text-slate-200">
                👥 Contact Management & RFM
              </h2>
              
              <div class="space-y-3">
                <div v-for="c in crmStore.contacts" :key="c.id" class="p-3 rounded-lg border border-white/5 bg-white/[0.01]">
                  <div class="flex justify-between items-start">
                    <h4 class="text-sm font-bold text-white">{{ c.name }}</h4>
                    <span :class="[
                      'text-[9px] px-1.5 py-0.2 rounded font-semibold',
                      c.rfmSegment === 'TOP' ? 'bg-emerald-950 border border-cyber-emerald/30 text-cyber-emerald' : 'bg-pink-950 border border-cyber-pink/30 text-cyber-pink'
                    ]">
                      RFM: {{ c.rfmSegment }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-400 mt-1">{{ c.phone }}</p>
                  
                  <div v-if="c.rfmSegment === 'CHURN_RISK'" class="mt-3 p-2 rounded bg-pink-950/10 border border-cyber-pink/15 text-[10px] text-cyber-pink">
                    🚨 14 kundan ortiq aloqa bo'lmaganligi sababli backend ogohlantiruvchi vazifa ochdi!
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<style>
/* Core layout styles */
body {
  margin: 0;
  background-color: #030008;
}
</style>
