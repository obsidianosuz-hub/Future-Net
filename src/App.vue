<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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
const cardTemplate = ref('cyber-purple')
const cardTelegram = ref('future_net_tg')
const cardFacebook = ref('future_net_fb')
const cardInstagram = ref('future_net_inst')
const cardLinkedin = ref('future_net_in')

const templateClasses = computed(() => {
  switch (cardTemplate.value) {
    case 'cyber-purple':
      return {
        cardBg: 'bg-gradient-to-b from-[#1c0024]/85 via-[#0a000d]/95 to-black',
        border: 'border-cyber-purple/40',
        shadow: 'shadow-[0_0_30px_rgba(217,70,239,0.25)]',
        badge: 'bg-purple-950/50 text-cyber-purple border-cyber-purple/30',
        avatarBg: 'from-cyber-purple to-purple-800 shadow-[0_0_15px_rgba(217,70,239,0.5)]',
        button: 'bg-cyber-purple/10 border-cyber-purple/30 text-cyber-purple hover:bg-cyber-purple/20'
      }
    case 'cyber-cyan':
      return {
        cardBg: 'bg-gradient-to-b from-[#00222b]/85 via-[#000d12]/95 to-black',
        border: 'border-cyber-cyan/40',
        shadow: 'shadow-[0_0_30px_rgba(6,182,212,0.25)]',
        badge: 'bg-cyan-950/50 text-cyber-cyan border-cyber-cyan/30',
        avatarBg: 'from-cyber-cyan to-cyan-800 shadow-[0_0_15px_rgba(6,182,212,0.5)]',
        button: 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/20'
      }
    case 'cyber-emerald':
      return {
        cardBg: 'bg-gradient-to-b from-[#002411]/85 via-[#000d05]/95 to-black',
        border: 'border-cyber-emerald/40',
        shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]',
        badge: 'bg-emerald-950/50 text-cyber-emerald border-cyber-emerald/30',
        avatarBg: 'from-cyber-emerald to-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.5)]',
        button: 'bg-cyber-emerald/10 border-cyber-emerald/30 text-cyber-emerald hover:bg-cyber-emerald/20'
      }
    case 'cyber-pink':
      return {
        cardBg: 'bg-gradient-to-b from-[#240011]/85 via-[#0d0005]/95 to-black',
        border: 'border-cyber-pink/40',
        shadow: 'shadow-[0_0_30px_rgba(244,63,94,0.25)]',
        badge: 'bg-pink-950/50 text-cyber-pink border-cyber-pink/30',
        avatarBg: 'from-cyber-pink to-pink-800 shadow-[0_0_15px_rgba(244,63,94,0.5)]',
        button: 'bg-cyber-pink/10 border-cyber-pink/30 text-cyber-pink hover:bg-cyber-pink/20'
      }
    case 'cyber-gold':
      return {
        cardBg: 'bg-gradient-to-b from-[#241700]/85 via-[#0d0800]/95 to-black',
        border: 'border-amber-500/40',
        shadow: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]',
        badge: 'bg-amber-950/50 text-amber-500 border-amber-500/30',
        avatarBg: 'from-amber-500 to-amber-700 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
        button: 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
      }
    default:
      return {
        cardBg: 'bg-slate-950',
        border: 'border-white/10',
        shadow: 'shadow-2xl',
        badge: 'bg-white/5 text-slate-400 border-white/10',
        avatarBg: 'from-slate-700 to-slate-800 shadow-none',
        button: 'bg-white/5 border-white/10 text-white hover:bg-white/10'
      }
  }
})

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

// Smart Reminders States
const newReminderChannel = ref<'SYSTEM' | 'TELEGRAM' | 'EMAIL'>('TELEGRAM')
const newReminderContactId = ref('')
const telegramUsername = ref('@feruza_dev')

// Telegram Simulation Modal States
const showTelegramModal = ref(false)
const telegramModalTitle = ref('')
const telegramModalBody = ref('')

const openTelegramSimulation = (reminder: any) => {
  telegramModalTitle.value = reminder.title
  telegramModalBody.value = reminder.message || 'Telegram orqali xabar yuborildi.'
  showTelegramModal.value = true
}

const handleAddReminder = async () => {
  if (!newReminderTitle.value) return
  
  let finalTitle = newReminderTitle.value
  let finalMessage = 'Redis va Cron yordamida eslatma yuborildi.'

  if (newReminderContactId.value) {
    const contact = crmStore.contacts.find(c => c.id === newReminderContactId.value)
    if (contact) {
      finalTitle = `Mijoz: ${contact.name} bilan bogʻlanish`
      finalMessage = `Eslatma: ${newReminderTitle.value}. Telefon: ${contact.phone}`
    }
  }

  await personalStore.addReminder({
    title: finalTitle,
    message: finalMessage,
    triggerTime: new Date(Date.now() + 5000).toISOString(),
    channel: newReminderChannel.value
  })

  notifStore.addSystemNotification('Eslatma oʻrnatildi', `${finalTitle} (${newReminderChannel.value})`, 'info')
  newReminderTitle.value = ''
  newReminderContactId.value = ''
}

// CRM Contact Manager State
const newContactName = ref('')
const newContactPhone = ref('')
const newContactEmail = ref('')

const editingContactId = ref('')
const editingContactName = ref('')
const editingContactPhone = ref('')
const editingContactEmail = ref('')
const showEditContactModal = ref(false)

const handleCreateContact = () => {
  if (!newContactName.value || !newContactPhone.value) {
    notifStore.addToast('Ism va telefon raqam majburiy!', 'error')
    return
  }
  crmStore.addContact(newContactName.value, newContactPhone.value, newContactEmail.value)
  notifStore.addToast('Yangi mijoz qoʻshildi!', 'success')
  newContactName.value = ''
  newContactPhone.value = ''
  newContactEmail.value = ''
}

const handleStartEditContact = (contact: any) => {
  editingContactId.value = contact.id
  editingContactName.value = contact.name
  editingContactPhone.value = contact.phone
  editingContactEmail.value = contact.email || ''
  showEditContactModal.value = true
}

const handleSaveEditContact = () => {
  if (!editingContactName.value || !editingContactPhone.value) {
    notifStore.addToast('Ism va telefon raqam majburiy!', 'error')
    return
  }
  crmStore.updateContact(
    editingContactId.value,
    editingContactName.value,
    editingContactPhone.value,
    editingContactEmail.value
  )
  notifStore.addToast('Mijoz maʻlumotlari tahrirlandi!', 'success')
  showEditContactModal.value = false
  editingContactId.value = ''
}

const handleSendTelegramTestMessage = async () => {
  if (!personalStore.telegramBotToken || !personalStore.telegramChatId) {
    notifStore.addToast('Bot Token va Chat ID kiritilishi shart!', 'error')
    return
  }
  
  try {
    const url = `https://api.telegram.org/bot${personalStore.telegramBotToken}/sendMessage`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: personalStore.telegramChatId,
        text: `🔔 *FUTURE NET BOT ALOQASI*:\n\nTabriklaymiz! Botingiz muvaffaqiyatli bogʻlandi.`,
        parse_mode: 'Markdown'
      })
    })
    
    if (res.ok) {
      notifStore.addToast('Test xabari Telegramga yuborildi!', 'success')
    } else {
      const data = await res.json()
      notifStore.addToast(`Xatolik: ${data.description || 'Nomaʻlum'}`, 'error')
    }
  } catch (err) {
    notifStore.addToast('Tarmoq xatoligi yoki notoʻgʻri Token', 'error')
  }
}

const handleCreateCard = async () => {
  if (!cardCompany.value || !cardPhone.value || !cardSlug.value) {
    notifStore.addToast('Kompaniya nomi, telefon va slug kiritilishi shart!', 'error')
    return
  }

  const socials = []
  if (cardTelegram.value) socials.push({ platform: 'TELEGRAM' as const, username: cardTelegram.value })
  if (cardFacebook.value) socials.push({ platform: 'FACEBOOK' as const, username: cardFacebook.value })
  if (cardInstagram.value) socials.push({ platform: 'INSTAGRAM' as const, username: cardInstagram.value })
  if (cardLinkedin.value) socials.push({ platform: 'LINKEDIN' as const, username: cardLinkedin.value })

  const res = await cardStore.createCard({
    companyName: cardCompany.value,
    phone: cardPhone.value,
    serviceType: cardService.value,
    slug: cardSlug.value,
    templateName: cardTemplate.value,
    socials
  })

  if (res.success) {
    notifStore.addToast('Raqamli Vizitka muvaffaqiyatli yaratildi!', 'success')
  } else {
    notifStore.addToast(res.message || 'Xatolik yuz berdi', 'error')
  }
}

const handleUpdateCard = async () => {
  if (!cardStore.activeCard) return
  if (!cardCompany.value || !cardPhone.value || !cardSlug.value) {
    notifStore.addToast('Kompaniya nomi, telefon va slug kiritilishi shart!', 'error')
    return
  }

  const socials = []
  if (cardTelegram.value) socials.push({ platform: 'TELEGRAM' as const, username: cardTelegram.value })
  if (cardFacebook.value) socials.push({ platform: 'FACEBOOK' as const, username: cardFacebook.value })
  if (cardInstagram.value) socials.push({ platform: 'INSTAGRAM' as const, username: cardInstagram.value })
  if (cardLinkedin.value) socials.push({ platform: 'LINKEDIN' as const, username: cardLinkedin.value })

  const res = await cardStore.updateCard(cardStore.activeCard.id, {
    companyName: cardCompany.value,
    phone: cardPhone.value,
    serviceType: cardService.value,
    slug: cardSlug.value,
    templateName: cardTemplate.value,
    socials
  })

  if (res.success) {
    notifStore.addToast('Vizitka muvaffaqiyatli yangilandi!', 'success')
  } else {
    notifStore.addToast('Yangilashda xatolik yuz berdi', 'error')
  }
}

const handleSelectCard = (card: any) => {
  cardStore.activeCard = card
  cardCompany.value = card.companyName
  cardPhone.value = card.phone
  cardService.value = card.serviceType
  cardSlug.value = card.slug
  cardTemplate.value = card.templateName || 'cyber-purple'
  
  // Extract socials
  const tg = card.socials.find((s: any) => s.platform === 'TELEGRAM')
  cardTelegram.value = tg ? tg.username : ''
  const fb = card.socials.find((s: any) => s.platform === 'FACEBOOK')
  cardFacebook.value = fb ? fb.username : ''
  const inst = card.socials.find((s: any) => s.platform === 'INSTAGRAM')
  cardInstagram.value = inst ? inst.username : ''
  const li = card.socials.find((s: any) => s.platform === 'LINKEDIN')
  cardLinkedin.value = li ? li.username : ''
}

// Education Ibrat Academy portal states
const eduActiveCategory = ref<'student' | 'teacher'>('student')
const showAdminSimulator = ref(false)
const eduUserName = ref('Toshmatov Ali')
const eduActiveVideoLesson = ref<any>(null)
const showQuizModal = ref(false)
const activeQuiz = ref<any>(null)
const quizAnswers = ref<Record<string, string>>({})

const teacherSelectedSubject = ref('sub-1')
const teacherCourseTitle = ref('')
const teacherCourseDesc = ref('')
const teacherSelectedCourse = ref('')
const teacherLessonTitle = ref('')
const teacherVideoUrl = ref('')
const teacherQuizSelectedCourse = ref('')
const teacherQuizTitle = ref('')
const teacherQuestionText = ref('')
const teacherCorrectAnswer = ref('')
const teacherWrongAnswer1 = ref('')
const teacherWrongAnswer2 = ref('')

const approvedCourses = computed(() => {
  return eduStore.courses.filter(c => eduStore.subjectPermissions[c.subjectId] === 'APPROVED')
})

const approvedQuizzes = computed(() => {
  return eduStore.quizzes.filter(q => {
    const course = eduStore.courses.find(c => c.id === q.courseId)
    return course && eduStore.subjectPermissions[course.subjectId] === 'APPROVED'
  })
})

const handleRequestStudentAccess = () => {
  if (!eduUserName.value) {
    notifStore.addToast('Iltimos foydalanuvchi ismingizni kiriting!', 'error')
    return
  }
  eduStore.requestRoleAccess('STUDENT', eduUserName.value)
  notifStore.addToast('Ruxsatnoma Ultra Adminga yuborildi!', 'info')
}

const handleRequestTeacherAccess = () => {
  if (!eduUserName.value) {
    notifStore.addToast('Iltimos ism sharifingizni kiriting!', 'error')
    return
  }
  eduStore.requestRoleAccess('TEACHER', eduUserName.value)
  notifStore.addToast('Shartnoma ruxsatnomasi Ultra Adminga yuborildi!', 'info')
}

const handleSubjectClick = (subject: any) => {
  const perm = eduStore.subjectPermissions[subject.id]
  if (perm === 'NONE' || perm === 'REJECTED') {
    if (!eduUserName.value) {
      eduUserName.value = 'Foydalanuvchi'
    }
    eduStore.requestSubjectAccess(subject.id, eduUserName.value)
    notifStore.addToast(`"${subject.name}" faniga ruxsatnoma Ultra Adminga yuborildi!`, 'info')
  } else if (perm === 'PENDING') {
    notifStore.addToast('Ushbu fanga ruxsatnoma hali kutilmoqda.', 'info')
  } else if (perm === 'APPROVED') {
    notifStore.addToast(`"${subject.name}" faniga allaqachon ruxsat berilgan. Quyidan darslarni ko'rishingiz mumkin!`, 'success')
  }
}

const handleMarkLessonComplete = async (lessonId: string, courseId: string) => {
  await eduStore.completeLesson(lessonId, courseId)
  notifStore.addToast('Dars yakunlandi! +50 XP olindi!', 'success')
  eduActiveVideoLesson.value = null
}

const handleStartQuiz = (quiz: any) => {
  activeQuiz.value = quiz
  quizAnswers.value = {}
  showQuizModal.value = true
}

const handleSolveQuiz = async () => {
  if (!activeQuiz.value) return
  let correctCount = 0
  activeQuiz.value.questions.forEach((q: any) => {
    const selectedAnsId = quizAnswers.value[q.id]
    const correctAns = q.answers.find((a: any) => a.isCorrect)
    if (selectedAnsId === correctAns?.id) {
      correctCount++
    }
  })
  
  const pct = Math.round((correctCount / activeQuiz.value.questions.length) * 100)
  const res = await eduStore.submitQuizAnswers(activeQuiz.value.id, pct)
  
  if (res.passed) {
    notifStore.addToast(`Tabriklaymiz! Testdan oʻtdingiz: ${pct}% (+100 XP)`, 'success')
  } else {
    notifStore.addToast(`Afsuski, oʻta olmadingiz: ${pct}%. Oʻtish bali: ${activeQuiz.value.passingScore}%`, 'error')
  }
  showQuizModal.value = false
  activeQuiz.value = null
}

const handleTeacherCreateCourse = () => {
  if (!teacherSelectedSubject.value || !teacherCourseTitle.value) {
    notifStore.addToast('Fan va Kurs nomini kiriting!', 'error')
    return
  }
  const c = eduStore.createCourse(teacherSelectedSubject.value, teacherCourseTitle.value, teacherCourseDesc.value)
  teacherSelectedCourse.value = c.id
  notifStore.addToast('Kurs muvaffaqiyatli yaratildi!', 'success')
  teacherCourseTitle.value = ''
  teacherCourseDesc.value = ''
}

const handleTeacherAddLesson = () => {
  if (!teacherSelectedCourse.value || !teacherLessonTitle.value) {
    notifStore.addToast('Kurs va Dars nomini kiriting!', 'error')
    return
  }
  eduStore.addLessonToCourse(teacherSelectedCourse.value, teacherLessonTitle.value, teacherVideoUrl.value)
  notifStore.addToast('Video dars kursga qoʻshildi!', 'success')
  teacherLessonTitle.value = ''
  teacherVideoUrl.value = ''
}

const handleTeacherCreateQuiz = () => {
  if (!teacherQuizSelectedCourse.value || !teacherQuizTitle.value || !teacherQuestionText.value || !teacherCorrectAnswer.value) {
    notifStore.addToast('Barcha maydonlarni kiriting!', 'error')
    return
  }

  const questions: any[] = [
    {
      id: `q-${Math.random().toString(36).substring(2, 9)}`,
      questionText: teacherQuestionText.value,
      points: 100,
      answers: [
        { id: 'a-c1', answerText: teacherCorrectAnswer.value, isCorrect: true },
        { id: 'a-w1', answerText: teacherWrongAnswer1.value || 'Variant B', isCorrect: false },
        { id: 'a-w2', answerText: teacherWrongAnswer2.value || 'Variant C', isCorrect: false }
      ]
    }
  ]

  eduStore.createQuiz(teacherQuizSelectedCourse.value, teacherQuizTitle.value, questions)
  notifStore.addToast('Test muvaffaqiyatli chop etildi!', 'success')
  teacherQuizTitle.value = ''
  teacherQuestionText.value = ''
  teacherCorrectAnswer.value = ''
  teacherWrongAnswer1.value = ''
  teacherWrongAnswer2.value = ''
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
              <h2 class="text-lg font-bold font-outfit mb-4 text-slate-200 flex items-center justify-between">
                <span>🔔 Smart Reminder</span>
                <span class="text-[9px] uppercase tracking-wider text-cyber-cyan bg-cyan-950/45 px-2 py-0.5 rounded border border-cyber-cyan/30">Redis + Cron</span>
              </h2>

              <!-- Active Reminders List -->
              <div class="space-y-3 mb-6 max-h-[220px] overflow-y-auto pr-1">
                <div 
                  v-for="r in personalStore.reminders" 
                  :key="r.id" 
                  class="p-3 rounded-lg border border-white/5 bg-white/[0.01] flex flex-col gap-2"
                >
                  <div class="flex items-start justify-between">
                    <div>
                      <h4 class="text-sm font-semibold text-white">{{ r.title }}</h4>
                      <p class="text-xs text-slate-400 mt-1">{{ r.message }}</p>
                    </div>
                    <span 
                      :class="[
                        'text-[9px] uppercase px-1.5 py-0.5 rounded font-mono',
                        r.channel === 'TELEGRAM' ? 'bg-cyan-950 text-cyber-cyan border border-cyber-cyan/30' :
                        r.channel === 'EMAIL' ? 'bg-purple-950 text-cyber-purple border border-cyber-purple/30' :
                        'bg-white/5 text-slate-400'
                      ]"
                    >
                      {{ r.channel }}
                    </span>
                  </div>

                  <!-- Action triggers for testing -->
                  <div class="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                    <span class="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span class="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse"></span>
                      Monitoring faol
                    </span>
                    
                    <button 
                      v-if="r.channel === 'TELEGRAM'"
                      @click="openTelegramSimulation(r)"
                      class="text-[10px] px-2.5 py-1 rounded bg-cyber-cyan/15 hover:bg-cyber-cyan/35 text-cyber-cyan border border-cyber-cyan/35 transition flex items-center gap-1 font-bold"
                    >
                      💬 Telegramga kirish (Simulatsiya)
                    </button>
                  </div>
                </div>
              </div>

              <!-- Create Reminder Form -->
              <div class="mt-4 border-t border-white/5 pt-4">
                <h3 class="text-xs uppercase font-mono tracking-wider text-slate-400 mb-3">Yangi Eslatma Oʻrnatish</h3>
                
                <div class="space-y-3">
                  <!-- Telegram Bot Settings (Real Telegram Messages) -->
                  <div class="border border-cyan-500/20 bg-cyan-950/10 rounded-xl p-3">
                    <details class="group" open>
                      <summary class="text-xs font-bold text-cyber-cyan cursor-pointer flex justify-between items-center select-none outline-none">
                        <span>⚙️ Real Telegram Bot Sozlamalari</span>
                        <span class="text-[9px] text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      
                      <div class="space-y-2.5 mt-3 pt-2.5 border-t border-white/5">
                        <p class="text-[10px] text-slate-400 leading-relaxed">
                          Haqiqiy Telegram xabarnomalarini olish uchun o'zingizning botingizni ulashingiz shart.
                        </p>
                        <div>
                          <label class="block text-[9px] text-slate-500 uppercase tracking-wider mb-1">Bot Token</label>
                          <input 
                            v-model="personalStore.telegramBotToken" 
                            @input="personalStore.setTelegramSettings(personalStore.telegramBotToken, personalStore.telegramChatId)"
                            type="password" 
                            placeholder="123456789:ABC..."
                            class="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                          />
                        </div>
                        <div>
                          <label class="block text-[9px] text-slate-500 uppercase tracking-wider mb-1">Telegram Chat ID (Raqamlarda)</label>
                          <input 
                            v-model="personalStore.telegramChatId" 
                            @input="personalStore.setTelegramSettings(personalStore.telegramBotToken, personalStore.telegramChatId)"
                            type="text" 
                            placeholder="Masalan: 987654321"
                            class="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                          />
                        </div>
                        <button 
                          @click="handleSendTelegramTestMessage" 
                          type="button"
                          class="w-full py-1.5 rounded-lg bg-cyber-cyan text-black font-extrabold text-[10px] uppercase hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
                        >
                          ⚡ Telegram Ulanishini Tekshirish (Test Xabar)
                        </button>
                        <div class="text-[9px] text-slate-500 leading-relaxed border-t border-white/5 pt-2">
                          💡 <b>Qanday faollashtiriladi:</b><br/>
                          1. Telegramda <a href="https://t.me/BotFather" target="_blank" class="text-cyber-cyan hover:underline">@BotFather</a> orqali bot oching va <b>Token</b>ni kiriting.<br/>
                          2. Botingizga kirib <b>/start</b> buyrug'ini bering.<br/>
                          3. <a href="https://t.me/userinfobot" target="_blank" class="text-cyber-cyan hover:underline">@userinfobot</a> botiga xabar yuborib <b>Chat ID</b>'ingizni oling va kiriting.
                        </div>
                      </div>
                    </details>
                  </div>
                  <!-- Channel selector -->
                  <div>
                    <label class="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Xabarnoma Kanali</label>
                    <div class="grid grid-cols-3 gap-2">
                      <button 
                        v-for="c in ['TELEGRAM', 'EMAIL', 'SYSTEM']" 
                        :key="c"
                        @click="newReminderChannel = c as any"
                        :class="[
                          'py-1 rounded text-[10px] font-bold border transition',
                          newReminderChannel === c 
                            ? 'border-cyber-cyan bg-cyber-cyan/15 text-cyber-cyan' 
                            : 'border-white/5 bg-white/[0.01] text-slate-400'
                        ]"
                      >
                        {{ c }}
                      </button>
                    </div>
                    <!-- Warning for Telegram config -->
                    <div 
                      v-if="newReminderChannel === 'TELEGRAM' && (!personalStore.telegramBotToken || !personalStore.telegramChatId)"
                      class="mt-2 p-2 rounded-lg bg-pink-950/20 border border-cyber-pink/30 text-[10px] text-cyber-pink leading-relaxed text-left"
                    >
                      🚨 <b>Muhim:</b> Real Telegram eslatmalarini olish uchun yuqoridagi <b>⚙️ Real Telegram Bot Sozlamalari</b> bo'limida Bot Token va Chat ID-ni sozlash shart!
                    </div>
                  </div>

                  <!-- Contact select for "Mijoz bilan bog'lanish" -->
                  <div>
                    <label class="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Mijoz bilan bogʻlash (CRM)</label>
                    <select 
                      v-model="newReminderContactId" 
                      class="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                    >
                      <option value="">-- Mijoz tanlanmagan --</option>
                      <option v-for="c in crmStore.contacts" :key="c.id" :value="c.id">
                        {{ c.name }} ({{ c.rfmSegment }})
                      </option>
                    </select>
                  </div>

                  <!-- Telegram handle details -->
                  <div v-if="newReminderChannel === 'TELEGRAM'">
                    <label class="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Telegram foydalanuvchi nomi</label>
                    <input 
                      v-model="telegramUsername"
                      type="text" 
                      placeholder="@username"
                      class="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                    />
                    <p class="text-[9px] text-slate-500 mt-1 leading-relaxed text-left">
                      ⚠️ <b>Eslatma:</b> Telegram botlar faqat foydalanuvchi nomi (@username) orqali to'g'ridan-to'g'ri xabar yubora olmaydi. Real xabarlarni olish uchun yuqoridagi "Real Telegram Bot Sozlamalari" panelini sozlang.
                    </p>
                  </div>

                  <!-- Reminder details -->
                  <div>
                    <label class="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Eslatma mazmuni</label>
                    <div class="flex gap-2">
                      <input 
                        v-model="newReminderTitle"
                        type="text" 
                        placeholder="Reja mazmuni..."
                        class="bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-cyan flex-1"
                      />
                      <button 
                        @click="handleAddReminder" 
                        class="px-3 py-1.5 rounded-xl bg-cyber-cyan text-black font-semibold text-xs hover:opacity-90 transition"
                      >
                        Aktivlash
                      </button>
                    </div>
                  </div>
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
          <!-- Left side: Form + List -->
          <div class="flex flex-col gap-6">
            <!-- Card Builder Form -->
            <GlassCard variant="purple">
              <h2 class="text-xl font-bold font-outfit mb-4 text-cyber-purple flex justify-between items-center">
                <span>🪪 Vizitka Konstruktori (Builder)</span>
                <span v-if="cardStore.activeCard" class="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyber-cyan border border-cyber-cyan/30 font-bold">
                  Tahrirlash rejimi
                </span>
              </h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1">Kompaniya nomi</label>
                  <input v-model="cardCompany" type="text" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-purple" />
                </div>
                <div>
                  <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1">Telefon raqam</label>
                  <input v-model="cardPhone" type="text" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-purple" />
                </div>
                <div>
                  <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1">Xizmat turi</label>
                  <input v-model="cardService" type="text" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-purple" />
                </div>
                <div>
                  <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1">Slug (URL uchun)</label>
                  <input v-model="cardSlug" type="text" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-purple" />
                  <p class="text-[10px] text-slate-500 mt-1 leading-relaxed text-left">
                    ℹ️ <b>Slug (URL)</b> - vizitkaning internetdagi shaxsiy sahifa manzili. Masalan, <code>futurenet.uz/v/slug-nomi</code>. QR-kod shu havolaga yo'naltiriladi.
                  </p>
                </div>

                <!-- Design Color Template Selector -->
                <div>
                  <label class="block text-xs uppercase tracking-wider text-slate-400 mb-2">Dizayn rangini tanlang</label>
                  <div class="grid grid-cols-5 gap-2">
                    <button 
                      v-for="t in [
                        { id: 'cyber-purple', name: 'Purple', colorBg: 'bg-cyber-purple' },
                        { id: 'cyber-cyan', name: 'Cyan', colorBg: 'bg-cyber-cyan' },
                        { id: 'cyber-emerald', name: 'Green', colorBg: 'bg-cyber-emerald' },
                        { id: 'cyber-pink', name: 'Pink', colorBg: 'bg-cyber-pink' },
                        { id: 'cyber-gold', name: 'Gold', colorBg: 'bg-amber-500' }
                      ]"
                      :key="t.id"
                      type="button"
                      @click="cardTemplate = t.id"
                      :class="[
                        'p-1.5 rounded-lg border text-[10px] font-bold transition-all flex flex-col items-center gap-1 hover:scale-105',
                        cardTemplate === t.id
                          ? 'border-white bg-white/10 text-white'
                          : 'border-white/5 bg-black/40 text-slate-400'
                      ]"
                    >
                      <span class="w-3 h-3 rounded-full" :class="t.colorBg"></span>
                      <span>{{ t.name }}</span>
                    </button>
                  </div>
                </div>

                <!-- Social Media Links Input Section -->
                <div class="border-t border-white/5 pt-3">
                  <label class="block text-xs uppercase tracking-wider text-slate-400 mb-2">Ijtimoiy tarmoqlar</label>
                  <div class="grid grid-cols-2 gap-2 text-left">
                    <div>
                      <label class="block text-[9px] text-slate-500 uppercase mb-0.5">Telegram Username</label>
                      <input v-model="cardTelegram" type="text" placeholder="Masalan: futurenet" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-purple" />
                    </div>
                    <div>
                      <label class="block text-[9px] text-slate-500 uppercase mb-0.5">Facebook Page</label>
                      <input v-model="cardFacebook" type="text" placeholder="Masalan: futurenet.uz" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-purple" />
                    </div>
                    <div>
                      <label class="block text-[9px] text-slate-500 uppercase mb-0.5">Instagram User</label>
                      <input v-model="cardInstagram" type="text" placeholder="Masalan: futurenet_ins" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-purple" />
                    </div>
                    <div>
                      <label class="block text-[9px] text-slate-500 uppercase mb-0.5">LinkedIn Page</label>
                      <input v-model="cardLinkedin" type="text" placeholder="Masalan: company/futurenet" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-purple" />
                    </div>
                  </div>
                </div>

                <div class="flex gap-2 border-t border-white/5 pt-3">
                  <button @click="handleCreateCard" class="flex-1 py-2.5 rounded-lg bg-cyber-purple text-white font-bold hover:opacity-90 transition shadow-lg shadow-purple-500/20">
                    Yangi Yaratish
                  </button>
                  <button 
                    v-if="cardStore.activeCard"
                    @click="handleUpdateCard" 
                    class="flex-1 py-2.5 rounded-lg border border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan font-bold hover:bg-cyber-cyan/20 transition"
                  >
                    O'zgarishlarni Saqlash
                  </button>
                </div>
              </div>
            </GlassCard>

            <!-- Yaratilgan Vizitkalar Ro'yxati -->
            <GlassCard variant="purple" class="!bg-black/[0.15]">
              <h3 class="text-sm font-bold font-outfit uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                <span>📂 Yaratilgan Vizitkalar Roʻyxati</span>
                <span class="text-[10px] text-slate-500 font-normal">({{ cardStore.cards.length }} dona)</span>
              </h3>
              <div v-if="cardStore.cards.length === 0" class="text-xs text-slate-500 py-6 text-center border border-white/5 rounded-xl bg-white/[0.01]">
                Hozircha vizitkalar yaratilmagan.
              </div>
              <div v-else class="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                <div 
                  v-for="c in cardStore.cards" 
                  :key="c.id"
                  @click="handleSelectCard(c)"
                  :class="[
                    'p-3 rounded-xl border transition-all cursor-pointer text-left flex justify-between items-center',
                    cardStore.activeCard?.id === c.id
                      ? 'border-cyber-purple bg-cyber-purple/10 shadow-[0_0_15px_rgba(217,70,239,0.15)]'
                      : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03]'
                  ]"
                >
                  <div>
                    <h4 class="text-xs font-bold text-white">{{ c.companyName }}</h4>
                    <p class="text-[10px] text-slate-400 mt-0.5">{{ c.serviceType }} | <code>/v/{{ c.slug }}</code></p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-[9px] px-1.5 py-0.5 rounded bg-purple-950/40 text-cyber-purple border border-cyber-purple/20 uppercase">
                      {{ c.templateName || 'cyber-purple' }}
                    </span>
                    <span class="text-[9px] text-slate-500" title="Yuklab olishlar soni">
                      📥 {{ c.downloadCount }}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          <!-- Vizitka Preview (Mobile-First) -->
          <div class="flex flex-col items-center justify-center p-6 border border-white/5 rounded-2xl bg-black/50 relative overflow-hidden h-fit self-start min-h-[580px]">
            <div class="absolute top-0 right-0 p-3 text-[10px] text-cyber-purple bg-purple-950/20 border-b border-l border-cyber-purple/20 rounded-bl-xl">
              QR Auto-Generated
            </div>
            
            <!-- Mobile Preview Frame -->
            <div 
              :class="[
                'w-[300px] h-[550px] rounded-[36px] border-[6px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between p-6 transition-all duration-300',
                templateClasses.cardBg,
                templateClasses.border,
                templateClasses.shadow
              ]"
            >
              <div class="text-center mt-6">
                <!-- Dynamic Avatar -->
                <div 
                  :class="[
                    'w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-white bg-gradient-to-tr transition-all duration-300',
                    templateClasses.avatarBg
                  ]"
                >
                  {{ cardCompany ? cardCompany.substring(0, 2).toUpperCase() : 'FN' }}
                </div>
                <h3 class="mt-4 font-bold text-white text-lg tracking-wide">{{ cardCompany }}</h3>
                <span 
                  :class="[
                    'text-xs px-2 py-0.5 rounded-full border transition-all duration-300',
                    templateClasses.badge
                  ]"
                >
                  {{ cardService }}
                </span>
              </div>

              <!-- Social Links Grid inside Preview -->
              <div v-if="cardTelegram || cardFacebook || cardInstagram || cardLinkedin" class="flex justify-center gap-2 mt-2">
                <a v-if="cardTelegram" :href="'https://t.me/' + cardTelegram" target="_blank" class="w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110" :class="templateClasses.button" title="Telegram">
                  <span class="text-[10px] font-bold">TG</span>
                </a>
                <a v-if="cardFacebook" :href="'https://facebook.com/' + cardFacebook" target="_blank" class="w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110" :class="templateClasses.button" title="Facebook">
                  <span class="text-[10px] font-bold">FB</span>
                </a>
                <a v-if="cardInstagram" :href="'https://instagram.com/' + cardInstagram" target="_blank" class="w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110" :class="templateClasses.button" title="Instagram">
                  <span class="text-[10px] font-bold">IG</span>
                </a>
                <a v-if="cardLinkedin" :href="'https://linkedin.com/in/' + cardLinkedin" target="_blank" class="w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110" :class="templateClasses.button" title="LinkedIn">
                  <span class="text-[10px] font-bold">IN</span>
                </a>
              </div>

              <!-- QR Code Box -->
              <div class="bg-black/60 border border-white/10 p-4 rounded-xl text-center my-3">
                <p class="text-[9px] uppercase tracking-wider text-slate-400 mb-1.5">QR skanerlash</p>
                <img 
                  :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://futurenet.uz/v/${cardSlug}`"
                  class="w-28 h-28 mx-auto rounded border border-white/20 p-1 bg-white" 
                  alt="QR Code"
                />
                <button 
                  @click="cardStore.recordQrDownload(cardStore.activeCard?.id || 'card-1')"
                  :class="[
                    'mt-2.5 text-[10px] px-3 py-1 rounded border w-full font-bold transition-all duration-300',
                    templateClasses.button
                  ]"
                >
                  QR Yuklash (Download) {{ cardStore.activeCard ? `(${cardStore.activeCard.downloadCount})` : '' }}
                </button>
              </div>

              <div class="text-center text-[10px] text-slate-400 mb-4">
                <p>Tel: {{ cardPhone }}</p>
                <p v-if="cardTelegram" class="mt-1">Telegram: @{{ cardTelegram }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. EDUCATION MODULI (Ibrat Academy Style) -->
        <div v-if="activeTab === 'education'" class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Left side: Category Dashboard (O'qituvchi / O'quvchi) -->
          <div class="lg:col-span-1 flex flex-col gap-4">
            <GlassCard variant="emerald">
              <h3 class="text-sm font-bold font-outfit uppercase tracking-wider text-cyber-emerald mb-4 text-left">
                📚 IBRAT ACADEMY DASHBOARD
              </h3>
              <div class="flex flex-col gap-2">
                <!-- O'quvchi category -->
                <button 
                  @click="eduActiveCategory = 'student'" 
                  :class="[
                    'w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between',
                    eduActiveCategory === 'student'
                      ? 'border-cyber-emerald bg-cyber-emerald/10 text-cyber-emerald'
                      : 'border-white/5 bg-white/[0.01] text-slate-400 hover:bg-white/[0.02]'
                  ]"
                >
                  <span class="flex items-center gap-2">👨‍🎓 Oʻquvchi (Student)</span>
                  <span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/40 text-cyber-emerald border border-cyber-emerald/20 font-bold uppercase font-mono">
                    {{ eduStore.studentRoleStatus }}
                  </span>
                </button>

                <!-- O'qituvchi category -->
                <button 
                  @click="eduActiveCategory = 'teacher'" 
                  :class="[
                    'w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between',
                    eduActiveCategory === 'teacher'
                      ? 'border-cyber-emerald bg-cyber-emerald/10 text-cyber-emerald'
                      : 'border-white/5 bg-white/[0.01] text-slate-400 hover:bg-white/[0.02]'
                  ]"
                >
                  <span class="flex items-center gap-2">👩‍🏫 Oʻqituvchi (Teacher)</span>
                  <span class="text-[9px] px-1.5 py-0.5 rounded bg-purple-950/40 text-cyber-purple border border-cyber-purple/20 font-bold uppercase font-mono">
                    {{ eduStore.teacherRoleStatus }}
                  </span>
                </button>
              </div>
            </GlassCard>

            <!-- Ultra Admin Simulator Toggle inside dashboard -->
            <GlassCard variant="cyan" class="!bg-cyan-950/5">
              <h3 class="text-xs font-bold font-outfit uppercase tracking-wider text-cyber-cyan mb-2 text-left">
                🛡️ Admin Simulator
              </h3>
              <p class="text-[10px] text-slate-400 mb-3 leading-relaxed text-left">
                Ruxsatnomalarni tasdiqlash uchun ushbu simulyatordan foydalaning.
              </p>
              <button 
                @click="showAdminSimulator = !showAdminSimulator"
                :class="[
                  'w-full py-2 rounded-lg text-xs font-bold transition border',
                  showAdminSimulator
                    ? 'bg-cyber-cyan text-black border-cyber-cyan'
                    : 'bg-transparent text-cyber-cyan border-cyber-cyan/30 hover:bg-cyber-cyan/10'
                ]"
              >
                {{ showAdminSimulator ? 'Simulyatorni Yopish' : 'Simulyatorni Ochish' }}
              </button>
            </GlassCard>
          </div>

          <!-- Right side: Core Content area (O'qituvchi / O'quvchi panel) -->
          <div class="lg:col-span-3 flex flex-col gap-6">

            <!-- Ultra Admin Simulation Box (if active) -->
            <div v-if="showAdminSimulator" class="p-4 rounded-2xl border border-cyber-cyan/30 bg-cyan-950/20 backdrop-blur-md">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-sm font-bold text-cyber-cyan flex items-center gap-2">
                  <span>🛡️ Ultra Admin Soʻrovlar Paneli (Simulyatsiya)</span>
                </h3>
                <span class="text-[9px] px-2 py-0.5 rounded bg-cyan-950 border border-cyber-cyan/40 text-cyber-cyan font-bold uppercase font-mono">
                  Ultra Admin Mode
                </span>
              </div>

              <div v-if="eduStore.requests.filter(r => r.status === 'PENDING').length === 0" class="text-xs text-slate-500 py-3 text-center">
                Tasdiqlash kutilayotgan so'rovlar mavjud emas.
              </div>
              <div v-else class="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                <div 
                  v-for="r in eduStore.requests.filter(r => r.status === 'PENDING')" 
                  :key="r.id"
                  class="p-2.5 rounded-xl border border-white/5 bg-black/40 flex justify-between items-center text-xs"
                >
                  <div class="text-left">
                    <p class="font-bold text-white">{{ r.userName }} 
                      <span class="text-[9px] px-1.5 py-0.2 rounded font-mono ml-2 uppercase font-mono"
                        :class="[
                          r.type === 'ROLE_TEACHER' ? 'bg-purple-950 text-cyber-purple border border-cyber-purple/20' :
                          r.type === 'ROLE_STUDENT' ? 'bg-emerald-950 text-cyber-emerald border border-cyber-emerald/20' :
                          'bg-cyan-950 text-cyber-cyan border border-cyber-cyan/20'
                        ]"
                      >
                        {{ r.type }}
                      </span>
                    </p>
                    <p class="text-[10px] text-slate-400 mt-1">{{ r.details }}</p>
                  </div>
                  <div class="flex gap-1.5">
                    <button @click="eduStore.approveRequest(r.id)" class="px-2.5 py-1 rounded bg-cyber-emerald text-black font-extrabold text-[10px] uppercase hover:opacity-90">
                      Ruxsat berish
                    </button>
                    <button @click="eduStore.rejectRequest(r.id)" class="px-2.5 py-1 rounded bg-cyber-pink text-white font-extrabold text-[10px] uppercase hover:opacity-90">
                      Rad etish
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- O'QUVCHI (STUDENT) VIEW -->
            <div v-if="eduActiveCategory === 'student'" class="flex flex-col gap-6">
              
              <!-- Check student role access -->
              <div v-if="eduStore.studentRoleStatus !== 'APPROVED'" class="p-8 rounded-2xl border border-white/10 bg-white/[0.01] text-center">
                <h3 class="text-lg font-bold text-white mb-2">👨‍🎓 Oʻquvchi Ruxsatnomasi</h3>
                <p class="text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
                  Kurslarda oʻqish va test topshirish uchun Ultra Admindan oʻquvchi ruxsatnomasini olishingiz shart.
                </p>
                <div v-if="eduStore.studentRoleStatus === 'NONE'" class="space-y-4">
                  <input v-model="eduUserName" type="text" placeholder="Foydalanuvchi ismingizni kiriting..." class="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyber-emerald max-w-xs mx-auto text-center block" />
                  <button @click="handleRequestStudentAccess" class="block w-full max-w-xs mx-auto py-2.5 rounded-lg bg-cyber-emerald text-black font-bold text-xs uppercase hover:opacity-90 transition">
                    Ruxsatnoma Soʻrash
                  </button>
                </div>
                <div v-else-if="eduStore.studentRoleStatus === 'PENDING'" class="text-cyber-cyan text-sm font-semibold animate-pulse">
                  ⏳ Ruxsatnoma so'ralgan. Ultra Admin simulyatorida so'rovingizni tasdiqlashingiz mumkin!
                </div>
                <div v-else-if="eduStore.studentRoleStatus === 'REJECTED'" class="text-cyber-pink text-sm font-semibold">
                  ❌ Ruxsatnoma rad etilgan. Qayta so'rov yuborishingiz mumkin.
                  <button @click="handleRequestStudentAccess" class="mt-4 block w-full max-w-xs mx-auto py-2.5 rounded-lg bg-cyber-emerald text-black font-bold text-xs uppercase hover:opacity-90">
                    Qayta so'rash
                  </button>
                </div>
              </div>

              <!-- Main Student Portal (if approved) -->
              <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Part 1 & 2: Available subjects + Lessons -->
                <div class="md:col-span-2 flex flex-col gap-6">
                  
                  <!-- Part 1: Subjects Table (Fanlar jadvali) -->
                  <GlassCard variant="emerald">
                    <h3 class="text-base font-bold font-outfit uppercase tracking-wider text-cyber-emerald mb-3 text-left">
                      📚 1-qism: Ibrat Academy Fanlar Katalogi (Subjects)
                    </h3>
                    <p class="text-xs text-slate-400 mb-4 text-left leading-relaxed">
                      Fandan foydalanish uchun ustiga bosing va Ultra Admildan ruxsatnoma oling. Ruxsat olingandan keyin video darslar va testlar ochiladi.
                    </p>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div 
                        v-for="s in eduStore.subjects" 
                        :key="s.id"
                        @click="handleSubjectClick(s)"
                        :class="[
                          'p-4 rounded-xl border transition-all cursor-pointer text-left relative overflow-hidden group',
                          eduStore.subjectPermissions[s.id] === 'APPROVED' ? 'border-cyber-emerald/40 bg-emerald-950/15 shadow-[0_0_10px_rgba(16,185,129,0.15)]' :
                          eduStore.subjectPermissions[s.id] === 'PENDING' ? 'border-cyber-cyan/40 bg-cyan-950/15 animate-pulse' :
                          'border-white/5 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02]'
                        ]"
                      >
                        <div class="flex items-center gap-3">
                          <span class="text-2xl">{{ s.icon }}</span>
                          <div>
                            <h4 class="text-sm font-bold text-white">{{ s.name }}</h4>
                            <p class="text-[10px] text-slate-400 mt-1 line-clamp-1">{{ s.description }}</p>
                          </div>
                        </div>
                        
                        <!-- Status Badge -->
                        <div class="mt-3 flex justify-between items-center text-[9px] uppercase tracking-wider font-mono">
                          <span class="text-slate-500">Holat:</span>
                          <span 
                            :class="[
                              'font-bold',
                              eduStore.subjectPermissions[s.id] === 'APPROVED' ? 'text-cyber-emerald' :
                              eduStore.subjectPermissions[s.id] === 'PENDING' ? 'text-cyber-cyan' :
                              'text-slate-400'
                            ]"
                          >
                            {{ eduStore.subjectPermissions[s.id] === 'APPROVED' ? 'Ruxsat berilgan' :
                               eduStore.subjectPermissions[s.id] === 'PENDING' ? 'Tasdiq kutilmoqda' :
                               'Qulflangan (Ruxsat soʻrash)' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  <!-- Part 2: Active online lessons (approved subjects only) -->
                  <GlassCard variant="emerald">
                    <h3 class="text-base font-bold font-outfit uppercase tracking-wider text-cyber-emerald mb-3 text-left">
                      🎥 2-qism: Video darslar & Online darslar
                    </h3>
                    
                    <!-- Filter approved subjects courses -->
                    <div class="space-y-4 text-left">
                      <div v-if="approvedCourses.length === 0" class="text-xs text-slate-500 py-6 text-center leading-relaxed">
                        Sizda hali ruxsat berilgan faol fanlar mavjud emas. Tepadagi fanlar jadvalini bosing va Ultra Admildan ruxsat oling!
                      </div>
                      
                      <div v-else v-for="c in approvedCourses" :key="c.id" class="p-4 rounded-xl border border-white/5 bg-black/40">
                        <div class="flex justify-between items-start mb-2">
                          <div>
                            <h4 class="text-sm font-bold text-white">{{ c.title }}</h4>
                            <p class="text-[10px] text-slate-400">{{ c.description }}</p>
                          </div>
                          <span class="text-xs font-mono text-cyber-emerald bg-emerald-950/40 px-2 py-0.5 rounded border border-cyber-emerald/20">
                            {{ eduStore.courseProgress(c.id) }}% completed
                          </span>
                        </div>

                        <!-- Progress Bar -->
                        <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-3">
                          <div class="bg-cyber-emerald h-full transition-all duration-300" :style="{ width: eduStore.courseProgress(c.id) + '%' }"></div>
                        </div>

                        <!-- Video Player Box Simulation -->
                        <div v-if="eduActiveVideoLesson && eduActiveVideoLesson.courseId === c.id" class="mb-4 rounded-xl border border-cyber-emerald/30 overflow-hidden bg-black shadow-neon-emerald/20">
                          <div class="relative pt-[56.25%]">
                            <iframe 
                              class="absolute top-0 left-0 w-full h-full"
                              :src="eduActiveVideoLesson.videoUrl"
                              title="YouTube video player" 
                              frameborder="0" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowfullscreen
                            ></iframe>
                          </div>
                          <div class="p-3 bg-black/90 flex justify-between items-center">
                            <span class="text-xs font-bold text-white">{{ eduActiveVideoLesson.title }}</span>
                            <button @click="handleMarkLessonComplete(eduActiveVideoLesson.id, c.id)" class="px-3 py-1 rounded bg-cyber-emerald text-black font-extrabold text-[10px] uppercase hover:opacity-90 transition">
                              Darsni Tamomlash (+50 XP)
                            </button>
                          </div>
                        </div>

                        <!-- Lessons list -->
                        <div class="grid grid-cols-1 gap-2 mt-2">
                          <div 
                            v-for="l in c.lessons" 
                            :key="l.id"
                            class="flex items-center justify-between p-2 rounded bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-cyber-emerald/20 transition text-xs"
                          >
                            <span class="font-medium text-slate-300">#{{ l.orderIndex }} - {{ l.title }}</span>
                            <div class="flex items-center gap-2">
                              <button @click="eduActiveVideoLesson = { ...l, courseId: c.id }" class="text-[10px] px-2 py-0.5 rounded bg-cyber-emerald/15 hover:bg-cyber-emerald/35 text-cyber-emerald border border-cyber-emerald/25 transition font-bold">
                                Video Dars 📺
                              </button>
                              <span v-if="eduStore.studentProfile.completedLessonIds.includes(l.id)" class="text-[10px] text-cyber-emerald bg-emerald-950 px-1.5 py-0.5 rounded font-bold border border-cyber-emerald/20 animate-pulse">
                                Yakunlandi ✔
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </GlassCard>
                </div>

                <!-- Part 3: Student Profile & Achievements and Test Solving -->
                <div class="flex flex-col gap-6">
                  <GlassCard variant="default">
                    <h3 class="text-base font-bold font-outfit uppercase tracking-wider text-slate-200 mb-3 text-left">
                      🎯 3-qism: Test topshirish & Profil
                    </h3>
                    
                    <div class="text-center py-4 border-b border-white/5">
                      <div class="w-16 h-16 rounded-full border-2 border-cyber-emerald mx-auto flex items-center justify-center text-3xl font-extrabold text-cyber-emerald shadow-neon-emerald animate-pulse">
                        {{ eduStore.currentLevel }}
                      </div>
                      <h4 class="mt-3 font-bold text-white text-sm">Oʻquvchi Darajasi</h4>
                      <p class="text-xs text-slate-400 mt-1">Level: {{ eduStore.currentLevel }} | {{ eduStore.totalXp }} XP</p>
                    </div>

                    <!-- Quizzes/Tests available for approved courses -->
                    <div class="mt-4">
                      <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 text-left">Faqat ruxsat berilgan testlar:</h4>
                      
                      <div v-if="approvedQuizzes.length === 0" class="text-xs text-slate-500 py-4 text-center">
                        Ruxsat berilgan fanlar bo'yicha testlar mavjud emas.
                      </div>
                      
                      <div v-else class="space-y-3">
                        <div v-for="q in approvedQuizzes" :key="q.id" class="p-3 rounded-xl bg-emerald-950/10 border border-cyber-emerald/20 text-left">
                          <p class="text-xs text-white font-medium">{{ q.title }}</p>
                          <p class="text-[10px] text-slate-400 mt-1">Savollar soni: {{ q.questions.length }} | O'tish bali: {{ q.passingScore }}%</p>
                          
                          <!-- Test solving mockup trigger -->
                          <div class="mt-3">
                            <button 
                              @click="handleStartQuiz(q)" 
                              class="w-full py-1.5 rounded bg-cyber-emerald text-black font-extrabold text-[10px] uppercase hover:opacity-90"
                            >
                              Testni Topsirish (+100 XP)
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Badges achieved -->
                    <div class="mt-5 border-t border-white/5 pt-3 text-left">
                      <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Eski yutuqlar (Badges):</h4>
                      <div v-if="eduStore.studentProfile.earnedBadges.length === 0" class="text-[10px] text-slate-500">Hali nishonlar yo'q. Test topshirib nishonlarni qo'lga kiriting!</div>
                      <div v-else class="flex flex-wrap gap-2">
                        <div 
                          v-for="b in eduStore.studentProfile.earnedBadges" 
                          :key="b.id"
                          class="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300"
                          :title="b.description"
                        >
                          <span>{{ b.iconUrl }}</span>
                          <span>{{ b.name }}</span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>

            <!-- O'QITUVCHI (TEACHER) VIEW -->
            <div v-if="eduActiveCategory === 'teacher'" class="flex flex-col gap-6">
              <!-- Check teacher role access -->
              <div v-if="eduStore.teacherRoleStatus !== 'APPROVED'" class="p-8 rounded-2xl border border-white/10 bg-white/[0.01] text-center">
                <h3 class="text-lg font-bold text-white mb-2">👩‍🏫 Oʻqituvchilar Shartnomasi</h3>
                <p class="text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
                  Platformada video darslar yuklash, kurs va dars tuzilmasini yaratish hamda testlar qoʻshish uchun Ultra Admin bilan shartnoma ruxsatnomasini tasdiqlashingiz kerak.
                </p>
                <div v-if="eduStore.teacherRoleStatus === 'NONE'" class="space-y-4">
                  <input v-model="eduUserName" type="text" placeholder="Ism sharifingizni kiriting..." class="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyber-purple max-w-xs mx-auto text-center block" />
                  <button @click="handleRequestTeacherAccess" class="block w-full max-w-xs mx-auto py-2.5 rounded-lg bg-cyber-purple text-white font-bold text-xs uppercase hover:opacity-90 transition">
                    Shartnoma va Ruxsat Soʻrash
                  </button>
                </div>
                <div v-else-if="eduStore.teacherRoleStatus === 'PENDING'" class="text-cyber-cyan text-sm font-semibold animate-pulse">
                  ⏳ Ultra Admindan shartnoma tasdig'i kutilmoqda. Yuqoridagi "🛡️ Admin Simulator" panelini ochib, ruxsat berishingiz mumkin!
                </div>
                <div v-else-if="eduStore.teacherRoleStatus === 'REJECTED'" class="text-cyber-pink text-sm font-semibold">
                  ❌ Shartnoma ruxsatnomasi rad etilgan.
                  <button @click="handleRequestTeacherAccess" class="mt-4 block w-full max-w-xs mx-auto py-2.5 rounded-lg bg-cyber-purple text-white font-bold text-xs uppercase hover:opacity-90">
                    Qayta so'rash
                  </button>
                </div>
              </div>

              <!-- Main Teacher Portal (if approved) -->
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Course & Lesson Creator -->
                <GlassCard variant="purple">
                  <h3 class="text-base font-bold font-outfit uppercase tracking-wider text-cyber-purple mb-4 text-left">
                    🎥 Video Kurs va Dars Joylash (Video Uploader)
                  </h3>
                  
                  <div class="space-y-4 text-left">
                    <div>
                      <label class="block text-xs text-slate-400 mb-1">Fanni tanlang</label>
                      <select v-model="teacherSelectedSubject" class="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-purple">
                        <option v-for="s in eduStore.subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
                      </select>
                    </div>

                    <!-- Create new Course -->
                    <div class="p-3 rounded-lg border border-white/5 bg-white/[0.01]">
                      <h4 class="text-xs font-bold text-cyber-purple mb-2">Yangi Kurs Yaratish</h4>
                      <div class="space-y-2">
                        <input v-model="teacherCourseTitle" type="text" placeholder="Kurs nomi (Masalan: Elementray A1)" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white" />
                        <input v-model="teacherCourseDesc" type="text" placeholder="Kurs tavsifi..." class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white" />
                        <button @click="handleTeacherCreateCourse" class="w-full py-1.5 rounded bg-cyber-purple text-white font-bold text-xs">Kursni Yaratish</button>
                      </div>
                    </div>

                    <!-- Add lesson to course -->
                    <div class="p-3 rounded-lg border border-white/5 bg-white/[0.01]">
                      <h4 class="text-xs font-bold text-cyber-purple mb-2">Kursga Video Dars Qoʻshish</h4>
                      <div class="space-y-2">
                        <label class="block text-[10px] text-slate-500">Kursni tanlang</label>
                        <select v-model="teacherSelectedCourse" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white">
                          <option v-for="c in eduStore.courses.filter(x => x.subjectId === teacherSelectedSubject)" :key="c.id" :value="c.id">{{ c.title }}</option>
                        </select>
                        <input v-model="teacherLessonTitle" type="text" placeholder="Dars nomi (Masalan: 1-dars: Alphabet)" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white" />
                        <input v-model="teacherVideoUrl" type="text" placeholder="YouTube Video URL Embed (Masalan: https://...)" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white" />
                        <button @click="handleTeacherAddLesson" class="w-full py-1.5 rounded bg-cyber-purple text-white font-bold text-xs">Video Darsni Yuklash</button>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <!-- Test / Quiz Creator -->
                <GlassCard variant="purple">
                  <h3 class="text-base font-bold font-outfit uppercase tracking-wider text-cyber-purple mb-4 text-left">
                    📝 Oʻquvchilar uchun Test/Quiz yaratish
                  </h3>
                  
                  <div class="space-y-4 text-left">
                    <div>
                      <label class="block text-xs text-slate-400 mb-1">Kursni tanlang</label>
                      <select v-model="teacherQuizSelectedCourse" class="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-purple">
                        <option v-for="c in eduStore.courses" :key="c.id" :value="c.id">{{ c.title }}</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-xs text-slate-400 mb-1">Test sarlavhasi</label>
                      <input v-model="teacherQuizTitle" type="text" placeholder="Masalan: Vue 3 Modul Test" class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-purple" />
                    </div>

                    <!-- Simple mockup question generator -->
                    <div class="p-3 rounded-lg border border-white/5 bg-white/[0.01]">
                      <h4 class="text-xs font-bold text-cyber-purple mb-2">Savol va Javoblar</h4>
                      <div class="space-y-2">
                        <input v-model="teacherQuestionText" type="text" placeholder="Savol matni (Masalan: NestJS nima?)" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white" />
                        <input v-model="teacherCorrectAnswer" type="text" placeholder="Toʻgʻri javob variant" class="w-full bg-black/40 border border-emerald-500/20 bg-emerald-950/10 rounded-lg px-2.5 py-1.5 text-xs text-white" />
                        <input v-model="teacherWrongAnswer1" type="text" placeholder="Notoʻgʻri javob variant 1" class="w-full bg-black/40 border border-pink-500/20 bg-pink-950/10 rounded-lg px-2.5 py-1.5 text-xs text-white" />
                        <input v-model="teacherWrongAnswer2" type="text" placeholder="Notoʻgʻri javob variant 2" class="w-full bg-black/40 border border-pink-500/20 bg-pink-950/10 rounded-lg px-2.5 py-1.5 text-xs text-white" />
                        <button @click="handleTeacherCreateQuiz" class="w-full py-1.5 rounded bg-cyber-purple text-white font-bold text-xs uppercase font-bold">Testni Saqlash va Chop etish</button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
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
            <!-- Yangi Mijoz Qoʻshish (Add Client) -->
            <GlassCard variant="purple">
              <h2 class="text-lg font-bold font-outfit mb-3 text-cyber-purple flex items-center gap-1.5">
                <span>👤</span> Yangi Mijoz Qoʻshish
              </h2>
              <div class="space-y-3">
                <div>
                  <label class="block text-[10px] text-slate-400 mb-1">Mijoz Ismi (Majburiy)</label>
                  <input v-model="newContactName" type="text" placeholder="Masalan: Jamshid Karimov" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-purple" />
                </div>
                <div>
                  <label class="block text-[10px] text-slate-400 mb-1">Telefon Raqami (Majburiy)</label>
                  <input v-model="newContactPhone" type="text" placeholder="+998901234567" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-purple" />
                </div>
                <div>
                  <label class="block text-[10px] text-slate-400 mb-1">Email (Ixtiyoriy)</label>
                  <input v-model="newContactEmail" type="text" placeholder="jamshid@mail.com" class="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-purple" />
                </div>
                <button @click="handleCreateContact" class="w-full py-2 rounded-lg bg-cyber-purple text-white font-bold text-xs hover:opacity-90 transition">
                  Mijozni Saqlash
                </button>
              </div>
            </GlassCard>

            <!-- Contact Card & RFM Segment -->
            <GlassCard variant="default">
              <h2 class="text-lg font-bold font-outfit mb-4 text-slate-200">
                👥 Contact Management & RFM
              </h2>
              
              <div class="space-y-3">
                <div v-for="c in crmStore.contacts" :key="c.id" class="p-3 rounded-lg border border-white/5 bg-white/[0.01]">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="text-sm font-bold text-white flex items-center gap-2">
                        <span>{{ c.name }}</span>
                        <button @click="handleStartEditContact(c)" class="text-xs text-cyber-purple hover:opacity-80" title="Tahrirlash">✏️</button>
                      </h4>
                      <p class="text-xs text-slate-400 mt-1">{{ c.phone }}</p>
                      <p v-if="c.email" class="text-[11px] text-slate-500 mt-0.5">{{ c.email }}</p>
                    </div>
                    <span :class="[
                      'text-[9px] px-1.5 py-0.2 rounded font-semibold',
                      c.rfmSegment === 'TOP' ? 'bg-emerald-950 border border-cyber-emerald/30 text-cyber-emerald' : 'bg-pink-950 border border-cyber-pink/30 text-cyber-pink'
                    ]">
                      RFM: {{ c.rfmSegment }}
                    </span>
                  </div>
                  
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

    <!-- Telegram Simulation Modal -->
    <div v-if="showTelegramModal" class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div class="w-full max-w-md bg-[#0e1621] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
        <!-- Telegram Header -->
        <div class="bg-[#17212b] p-4 flex items-center justify-between border-b border-white/5">
          <div class="flex items-center gap-3">
            <!-- Simulated Avatar -->
            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
              FN
            </div>
            <div>
              <h3 class="text-white font-bold text-sm">Future Net Bot</h3>
              <p class="text-sky-400 text-xs flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                online
              </p>
            </div>
          </div>
          <button @click="showTelegramModal = false" class="text-slate-400 hover:text-white text-lg font-bold p-1">
            ✕
          </button>
        </div>

        <!-- Telegram Messages Area -->
        <div class="flex-1 p-4 overflow-y-auto bg-[#0e1621] space-y-4 flex flex-col justify-end" style="background-image: radial-gradient(rgba(255,255,255,0.015) 1px, transparent 0); background-size: 20px 20px;">
          <!-- User Username validation message -->
          <div class="self-start max-w-[80%] rounded-2xl px-4 py-2 text-sm bg-[#182533] text-slate-300">
            <p class="text-xs text-sky-400 mb-1">Muloqot boshlandi</p>
            Siz muvaffaqiyatli tarzda <b>{{ telegramUsername }}</b> hisobi orqali eslatmalar botiga ulandingiz.
          </div>

          <!-- Bot notification template message -->
          <div class="self-start max-w-[80%] rounded-2xl px-4 py-3.5 text-sm bg-[#182533] text-slate-100 border border-cyan-500/20 shadow-lg">
            <div class="text-[10px] text-cyan-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
              <span>🔔 Future Net Reminder</span>
              <span class="w-1 h-1 rounded-full bg-cyan-400"></span>
              <span>Redis Worker</span>
            </div>
            <p class="font-bold text-white mb-2">{{ telegramModalTitle }}</p>
            <p class="text-xs text-slate-300 leading-relaxed">{{ telegramModalBody }}</p>
            <div class="text-[9px] text-slate-500 mt-3 text-right">
              {{ new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) }}
            </div>
          </div>
        </div>

        <!-- Telegram Footer Input -->
        <div class="bg-[#17212b] p-4 flex gap-2 border-t border-white/5">
          <input 
            type="text" 
            readonly 
            value="Xabar yuborish faqat bot orqali amalga oshiriladi..." 
            class="bg-[#24303f] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-400 flex-1 outline-none cursor-not-allowed"
          />
          <button @click="showTelegramModal = false" class="px-4 py-2 bg-sky-500 text-white rounded-xl text-xs font-bold hover:bg-sky-600 transition">
            Yopish
          </button>
        </div>
      </div>
    </div>

    <!-- Quiz/Test Modal -->
    <div v-if="showQuizModal && activeQuiz" class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <GlassCard variant="emerald" class="w-full max-w-lg border border-cyber-emerald/40 relative">
        <h3 class="text-lg font-bold font-outfit mb-4 text-cyber-emerald flex justify-between items-center">
          <span>📝 {{ activeQuiz.title }}</span>
          <button @click="showQuizModal = false" class="text-slate-400 hover:text-white text-sm">✕</button>
        </h3>
        
        <div class="space-y-6 max-h-[400px] overflow-y-auto pr-1">
          <div v-for="(q, qIndex) in activeQuiz.questions" :key="q.id" class="p-4 rounded-xl border border-white/5 bg-black/40 text-left">
            <p class="text-sm font-bold text-white mb-3">{{ qIndex + 1 }}. {{ q.questionText }}</p>
            <div class="space-y-2">
              <label 
                v-for="a in q.answers" 
                :key="a.id"
                class="flex items-center gap-3 p-2.5 rounded-lg border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] cursor-pointer transition text-xs"
              >
                <input 
                  type="radio" 
                  :name="q.id" 
                  :value="a.id" 
                  v-model="quizAnswers[q.id]"
                  class="accent-cyber-emerald"
                />
                <span class="text-slate-300">{{ a.answerText }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex gap-2 justify-end border-t border-white/5 pt-3 mt-4">
          <button @click="showQuizModal = false" class="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-xs text-white transition">
            Bekor Qilish
          </button>
          <button @click="handleSolveQuiz" class="px-4 py-2 rounded bg-cyber-emerald text-black font-extrabold text-xs hover:opacity-90 transition">
            Testni Yakunlash (Topsirish)
          </button>
        </div>
      </GlassCard>
    </div>

    <!-- Edit Contact Modal -->
    <div v-if="showEditContactModal" class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <GlassCard variant="purple" class="w-full max-w-md border border-cyber-purple/40 relative">
        <h3 class="text-lg font-bold font-outfit mb-4 text-cyber-purple flex justify-between items-center">
          <span>✏️ Mijoz Maʻlumotlarini Tahrirlash</span>
          <button @click="showEditContactModal = false" class="text-slate-400 hover:text-white text-sm">✕</button>
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1">Mijoz Ismi</label>
            <input v-model="editingContactName" type="text" class="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-purple" />
          </div>
          <div>
            <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1">Telefon Raqami</label>
            <input v-model="editingContactPhone" type="text" class="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-purple" />
          </div>
          <div>
            <label class="block text-xs uppercase tracking-wider text-slate-400 mb-1">Email</label>
            <input v-model="editingContactEmail" type="text" class="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-purple" />
          </div>
          <div class="flex gap-2 justify-end border-t border-white/5 pt-3">
            <button @click="showEditContactModal = false" class="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-xs text-white transition">
              Bekor Qilish
            </button>
            <button @click="handleSaveEditContact" class="px-4 py-2 rounded bg-cyber-purple text-white font-bold text-xs hover:opacity-90 transition">
              Saqlash
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<style>
/* Core layout styles */
body {
  margin: 0;
  background-color: #030008;
}
</style>
