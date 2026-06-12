import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Lesson {
  id: string
  title: string
  content?: string
  videoUrl?: string
  orderIndex: number
}

export interface Course {
  id: string
  subjectId: string
  title: string
  description: string
  category: string
  lessons: Lesson[]
}

export interface QuizQuestion {
  id: string
  questionText: string
  points: number
  answers: Array<{ id: string; answerText: string; isCorrect: boolean }>
}

export interface Quiz {
  id: string
  courseId: string
  title: string
  passingScore: number
  questions: QuizQuestion[]
}

export interface Badge {
  id: string
  name: string
  description: string
  iconUrl: string
  xpRequired: number
}

export interface StudentProfile {
  xp: number
  level: number
  completedLessonIds: string[]
  earnedBadges: Badge[]
}

export interface Subject {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

export interface EducationRequest {
  id: string
  type: 'ROLE_STUDENT' | 'ROLE_TEACHER' | 'SUBJECT_ACCESS'
  subjectId?: string
  userName: string
  details: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export const useEducationStore = defineStore('education', () => {
  const subjects = ref<Subject[]>([
    { id: 'sub-1', name: 'Ingliz tili', description: 'Elementarydan Advancedgacha Ibrat Academy dasturi', icon: '🇬🇧', color: 'from-blue-600 to-indigo-900' },
    { id: 'sub-2', name: 'Koreys tili', description: 'TOPIK darajalari va kundalik soʻzlashuv darslari', icon: '🇰🇷', color: 'from-red-600 to-blue-800' },
    { id: 'sub-3', name: 'Nemis tili', description: 'A1-C1 nemis tili grammatikasi va leksikasi', icon: '🇩🇪', color: 'from-amber-600 to-amber-950' },
    { id: 'sub-4', name: 'Web Dasturlash', description: 'Vue 3, Pinia va NestJS bilan toʻliq stack yaratish', icon: '💻', color: 'from-emerald-600 to-teal-900' }
  ])

  const courses = ref<Course[]>([
    {
      id: 'course-1',
      subjectId: 'sub-4',
      title: 'Frontend Mastery: Vue 3',
      description: 'Composition API va Pinia bilan ishlashni mukammal oʻrganing',
      category: 'Programming',
      lessons: [
        { id: 'les-1', title: 'Kirish va Scaffolding', orderIndex: 1, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { id: 'les-2', title: 'Composition API asoslari', orderIndex: 2, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
      ]
    },
    {
      id: 'course-2',
      subjectId: 'sub-1',
      title: 'English Elementary (A1-A2)',
      description: 'Ibrat Academy rasmiy A1 ingliz tili darslari stegi',
      category: 'Languages',
      lessons: [
        { id: 'les-3', title: 'Alphabet & Basic Greetings', orderIndex: 1, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { id: 'les-4', title: 'Verb To Be & Simple Sentences', orderIndex: 2, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
      ]
    }
  ])

  const quizzes = ref<Quiz[]>([
    {
      id: 'quiz-1',
      courseId: 'course-1',
      title: 'Vue 3 & Pinia Testi',
      passingScore: 80,
      questions: [
        {
          id: 'q-1',
          questionText: 'Pinia-da state qanday eʻlon qilinadi?',
          points: 50,
          answers: [
            { id: 'a-1', answerText: 'ref() yordamida', isCorrect: true },
            { id: 'a-2', answerText: 'method yordamida', isCorrect: false },
            { id: 'a-3', answerText: 'computed() yordamida', isCorrect: false }
          ]
        },
        {
          id: 'q-2',
          questionText: 'Composition API-da lifecycle hook qaysi biri?',
          points: 50,
          answers: [
            { id: 'a-4', answerText: 'onMounted', isCorrect: true },
            { id: 'a-5', answerText: 'created', isCorrect: false },
            { id: 'a-6', answerText: 'destroyed', isCorrect: false }
          ]
        }
      ]
    },
    {
      id: 'quiz-2',
      courseId: 'course-2',
      title: 'English Basics Quiz',
      passingScore: 70,
      questions: [
        {
          id: 'q-3',
          questionText: 'Which greeting is used in the morning?',
          points: 100,
          answers: [
            { id: 'a-7', answerText: 'Good morning', isCorrect: true },
            { id: 'a-8', answerText: 'Good night', isCorrect: false }
          ]
        }
      ]
    }
  ])

  const badges = ref<Badge[]>([
    { id: 'bd-1', name: 'Poliglot', description: 'Ikkita til darsini tugatgani uchun', iconUrl: '🏅', xpRequired: 200 },
    { id: 'bd-2', name: 'Frontend Hero', description: 'Vue 3 testidan muvaffaqiyatli oʻtgani uchun', iconUrl: '🚀', xpRequired: 100 }
  ])

  const studentProfile = ref<StudentProfile>({
    xp: 0,
    level: 1,
    completedLessonIds: [],
    earnedBadges: []
  })

  // Role status: 'NONE' | 'PENDING' | 'APPROVED'
  const studentRoleStatus = ref<'NONE' | 'PENDING' | 'APPROVED'>('APPROVED')
  const teacherRoleStatus = ref<'NONE' | 'PENDING' | 'APPROVED'>('NONE')

  // Subject permission status: Record<subjectId, 'NONE' | 'PENDING' | 'APPROVED'>
  const subjectPermissions = ref<Record<string, 'NONE' | 'PENDING' | 'APPROVED'>>({
    'sub-1': 'NONE',
    'sub-2': 'NONE',
    'sub-3': 'NONE',
    'sub-4': 'NONE'
  })

  // Admin notification requests queue
  const requests = ref<EducationRequest[]>([
    {
      id: 'req-1',
      type: 'ROLE_TEACHER',
      userName: 'Toshmatov Ali',
      details: 'Ingliz tili fanidan video darslar joylash va shartnoma imzolash',
      status: 'PENDING'
    }
  ])

  const isLoading = ref(false)

  // Getters
  const totalXp = computed(() => studentProfile.value.xp)
  const currentLevel = computed(() => studentProfile.value.level)

  const courseProgress = computed(() => {
    return (courseId: string) => {
      const course = courses.value.find((c) => c.id === courseId)
      if (!course || course.lessons.length === 0) return 0
      const totalLessons = course.lessons.length
      const completedInCourse = course.lessons.filter((l) =>
        studentProfile.value.completedLessonIds.includes(l.id)
      ).length
      return Math.round((completedInCourse / totalLessons) * 100)
    }
  })

  // Actions
  const requestRoleAccess = (role: 'STUDENT' | 'TEACHER', userName: string) => {
    const type = role === 'STUDENT' ? 'ROLE_STUDENT' : 'ROLE_TEACHER'
    const status = role === 'STUDENT' ? studentRoleStatus : teacherRoleStatus

    status.value = 'PENDING'

    requests.value.push({
      id: `req-${Math.random().toString(36).substring(2, 9)}`,
      type,
      userName,
      details: role === 'STUDENT' 
        ? 'Oʻquvchi sifatida barcha onlayn kurslar jadvaliga ulanish' 
        : 'Oʻqituvchi sifatida shartnoma qilib, kurs va testlar qoʻshish',
      status: 'PENDING'
    })
  }

  const requestSubjectAccess = (subjectId: string, userName: string) => {
    subjectPermissions.value[subjectId] = 'PENDING'
    const sub = subjects.value.find(s => s.id === subjectId)

    requests.value.push({
      id: `req-${Math.random().toString(36).substring(2, 9)}`,
      type: 'SUBJECT_ACCESS',
      subjectId,
      userName,
      details: `"${sub?.name || 'Nomaʻlum fanga'}" kirish ruxsatnomasi soʻrovi`,
      status: 'PENDING'
    })
  }

  const approveRequest = (reqId: string) => {
    const req = requests.value.find(r => r.id === reqId)
    if (req) {
      req.status = 'APPROVED'
      if (req.type === 'ROLE_STUDENT') {
        studentRoleStatus.value = 'APPROVED'
      } else if (req.type === 'ROLE_TEACHER') {
        teacherRoleStatus.value = 'APPROVED'
      } else if (req.type === 'SUBJECT_ACCESS' && req.subjectId) {
        subjectPermissions.value[req.subjectId] = 'APPROVED'
      }
    }
  }

  const rejectRequest = (reqId: string) => {
    const req = requests.value.find(r => r.id === reqId)
    if (req) {
      req.status = 'REJECTED'
      if (req.type === 'ROLE_STUDENT') {
        studentRoleStatus.value = 'REJECTED'
      } else if (req.type === 'ROLE_TEACHER') {
        teacherRoleStatus.value = 'REJECTED'
      } else if (req.type === 'SUBJECT_ACCESS' && req.subjectId) {
        subjectPermissions.value[req.subjectId] = 'REJECTED'
      }
    }
  }

  const createCourse = (subjectId: string, title: string, description: string) => {
    const newCourse: Course = {
      id: `course-${Math.random().toString(36).substring(2, 9)}`,
      subjectId,
      title,
      description,
      category: 'General',
      lessons: []
    }
    courses.value.push(newCourse)
    return newCourse
  }

  const addLessonToCourse = (courseId: string, title: string, videoUrl: string) => {
    const course = courses.value.find(c => c.id === courseId)
    if (course) {
      const nextIndex = course.lessons.length + 1
      course.lessons.push({
        id: `les-${Math.random().toString(36).substring(2, 9)}`,
        title,
        orderIndex: nextIndex,
        videoUrl: videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      })
    }
  }

  const createQuiz = (courseId: string, title: string, questions: QuizQuestion[]) => {
    const newQuiz: Quiz = {
      id: `quiz-${Math.random().toString(36).substring(2, 9)}`,
      courseId,
      title,
      passingScore: 70,
      questions
    }
    quizzes.value.push(newQuiz)
    return newQuiz
  }

  const completeLesson = async (lessonId: string, courseId: string) => {
    if (!studentProfile.value.completedLessonIds.includes(lessonId)) {
      studentProfile.value.completedLessonIds.push(lessonId)
      studentProfile.value.xp += 50
      checkLevelUp()
    }
  }

  const checkLevelUp = () => {
    const xpNeeded = studentProfile.value.level * 200
    if (studentProfile.value.xp >= xpNeeded) {
      studentProfile.value.level++
      studentProfile.value.xp -= xpNeeded
    }
  }

  const submitQuizAnswers = async (quizId: string, scorePercentage: number) => {
    const quiz = quizzes.value.find((q) => q.id === quizId)
    if (quiz && scorePercentage >= quiz.passingScore) {
      studentProfile.value.xp += 100
      checkLevelUp()
      // Grant badges
      if (quizId === 'quiz-1') {
        const hasHeroBadge = studentProfile.value.earnedBadges.some(b => b.id === 'bd-2')
        if (!hasHeroBadge) {
          const hero = badges.value.find(b => b.id === 'bd-2')
          if (hero) studentProfile.value.earnedBadges.push(hero)
        }
      }
      return { passed: true }
    }
    return { passed: false }
  }

  return {
    subjects,
    courses,
    quizzes,
    badges,
    studentProfile,
    studentRoleStatus,
    teacherRoleStatus,
    subjectPermissions,
    requests,
    isLoading,
    totalXp,
    currentLevel,
    courseProgress,
    requestRoleAccess,
    requestSubjectAccess,
    approveRequest,
    rejectRequest,
    createCourse,
    addLessonToCourse,
    createQuiz,
    completeLesson,
    submitQuizAnswers
  }
})
