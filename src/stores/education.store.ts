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
  title: string
  description: string
  coverImage?: string
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

export const useEducationStore = defineStore('education', () => {
  const courses = ref<Course[]>([])
  const currentCourse = ref<Course | null>(null)
  const currentLesson = ref<Lesson | null>(null)
  const quizzes = ref<Quiz[]>([])
  const badges = ref<Badge[]>([])
  const studentProfile = ref<StudentProfile>({
    xp: 0,
    level: 1,
    completedLessonIds: [],
    earnedBadges: []
  })
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
  const fetchCourses = async () => {
    isLoading.value = true
    try {
      courses.value = [
        {
          id: 'course-1',
          title: 'Frontend Mastery: Vue 3',
          description: 'Composition API va Pinia bilan ishlashni mukammal oʻrganing',
          category: 'Programming',
          lessons: [
            { id: 'les-1', title: 'Kirish va Scaffolding', orderIndex: 1, videoUrl: 'https://video.uz/1' },
            { id: 'les-2', title: 'Composition API asoslari', orderIndex: 2, videoUrl: 'https://video.uz/2' }
          ]
        }
      ]
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  const completeLesson = async (lessonId: string, courseId: string) => {
    if (!studentProfile.value.completedLessonIds.includes(lessonId)) {
      studentProfile.value.completedLessonIds.push(lessonId)
      // Gain XP
      studentProfile.value.xp += 50
      checkLevelUp()
      // Real backend synchronization here
    }
  }

  const checkLevelUp = () => {
    const xpNeeded = studentProfile.value.level * 200
    if (studentProfile.value.xp >= xpNeeded) {
      studentProfile.value.level++
      studentProfile.value.xp -= xpNeeded
      // Add level badges or alerts
    }
  }

  const submitQuizAnswers = async (quizId: string, scorePercentage: number) => {
    const quiz = quizzes.value.find((q) => q.id === quizId)
    if (quiz && scorePercentage >= quiz.passingScore) {
      studentProfile.value.xp += 100
      checkLevelUp()
      return { passed: true }
    }
    return { passed: false }
  }

  return {
    courses,
    currentCourse,
    currentLesson,
    quizzes,
    badges,
    studentProfile,
    isLoading,
    totalXp,
    currentLevel,
    courseProgress,
    fetchCourses,
    completeLesson,
    submitQuizAnswers
  }
})
