import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  tenantId: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  role: {
    id: string
    name: string
    permissions: Array<{ action: string; subject: string }>
  }
  featureAccess: {
    personalAccess: boolean
    businessCardAccess: boolean
    educationAccess: boolean
    restaurantAccess: boolean
    salesAccess: boolean
    crmAccess: boolean
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('fn_token'))
  const faceAuthInProgress = ref(false)
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Rolga qarab u orqali ruxsatlarni tekshirish
  const hasPermission = (action: string, subject: string): boolean => {
    if (!user.value) return false
    const roleName = user.value.role.name
    
    // Ultra Admin va Super Admin hamma narsaga ruxsat oladi
    if (roleName === 'Ultra Admin' || roleName === 'Super Admin') return true
    
    return user.value.role.permissions.some(
      (p) => p.action === action && p.subject === subject
    )
  }

  // Modulga kirish huquqini tekshirish (Feature Toggles)
  const hasFeatureAccess = (feature: keyof User['featureAccess']): boolean => {
    if (!user.value) return false
    // Ultra Admin hamma modulga kira oladi
    if (user.value.role.name === 'Ultra Admin') return true
    return !!user.value.featureAccess[feature]
  }

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('fn_token', newToken)
  }

  const login = async (email: string, passwordHash: string) => {
    try {
      // API call bo'ladi bu yerda
      // Mock Data:
      const mockUser: User = {
        id: 'user-uuid-1',
        tenantId: 'tenant-uuid-1',
        email: email,
        firstName: 'Farrux',
        lastName: 'Rustamov',
        phone: '+998901234567',
        role: {
          id: 'role-dev-id',
          name: 'Developer',
          permissions: [
            { action: 'READ', subject: 'SYSTEM_LOG' },
            { action: 'CREATE', subject: 'TELEGRAM_BOT' }
          ]
        },
        featureAccess: {
          personalAccess: true,
          businessCardAccess: true,
          educationAccess: true,
          restaurantAccess: true,
          salesAccess: true,
          crmAccess: true
        }
      }
      user.value = mockUser
      setToken('mock-jwt-token-xyz')
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Kirishda xatolik yuz berdi' }
    }
  }

  const loginWithFaceId = async (faceImageBase64: string) => {
    faceAuthInProgress.value = true
    try {
      // Python Face Recognition microservice API ga yuboriladi
      // Mock API call:
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      const mockUser: User = {
        id: 'user-uuid-2',
        tenantId: 'tenant-uuid-1',
        email: 'face_admin@futurenet.com',
        firstName: 'Ali',
        lastName: 'Valiyev',
        phone: '+998997654321',
        role: {
          id: 'role-super-admin',
          name: 'Super Admin',
          permissions: []
        },
        featureAccess: {
          personalAccess: true,
          businessCardAccess: true,
          educationAccess: true,
          restaurantAccess: true,
          salesAccess: true,
          crmAccess: true
        }
      }
      user.value = mockUser
      setToken('mock-face-jwt-token-123')
      return { success: true }
    } catch (error) {
      console.error('Face ID recognition failed:', error)
      return { success: false, message: 'Yuzni aniqlash muvaffaqiyatsiz tugadi' }
    } finally {
      faceAuthInProgress.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('fn_token')
  }

  return {
    user,
    token,
    faceAuthInProgress,
    isAuthenticated,
    hasPermission,
    hasFeatureAccess,
    login,
    loginWithFaceId,
    logout
  }
})
