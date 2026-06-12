import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type DeliveryStatus = 'RECEIVED' | 'PACKING' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED'

export interface Product {
  id: string
  name: string
  categoryId: string
  price: number
  stockQty: number
  minStockQty: number
  barcode?: string
  imageUrl?: string
}

export interface SalesOrder {
  id: string
  customerId: string
  customerName: string
  status: DeliveryStatus
  totalAmount: number
  channel: 'WEB' | 'TELEGRAM' | 'INSTAGRAM'
  shippingAddress: string
  deliveryCoordinates?: { lat: number; lng: number }
  createdAt: string
}

export interface Installment {
  id: string
  orderId: string
  totalAmount: number
  monthsCount: number
  monthlyAmount: number
  nextPayDate: string
  isCompleted: boolean
}

export const useSalesStore = defineStore('sales', () => {
  const products = ref<Product[]>([])
  const orders = ref<SalesOrder[]>([])
  const installments = ref<Installment[]>([])
  const activeOrder = ref<SalesOrder | null>(null)
  const isLoading = ref(false)

  // Getters
  const stockAlertProducts = computed(() => {
    return products.value.filter((p) => p.stockQty <= p.minStockQty)
  })

  const omnichannelInbox = computed(() => {
    // Kelib tushgan buyurtmalar inbox
    return orders.value.filter((o) => o.status === 'RECEIVED')
  })

  // Actions
  const fetchProducts = async () => {
    products.value = [
      { id: 'prod-1', name: 'Cyberpunk Jacket', categoryId: 'clothing', price: 1200000, stockQty: 12, minStockQty: 3, barcode: '4780012345678' },
      { id: 'prod-2', name: 'Glassmorphic Mug', categoryId: 'accessories', price: 85000, stockQty: 2, minStockQty: 5, barcode: '4780087654321' }
    ]
  }

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substring(2, 9)
    }
    products.value.push(newProduct)
  }

  // Sotilganda avtomat kamayish
  const createSalesOrder = async (orderData: Omit<SalesOrder, 'id' | 'createdAt' | 'status'>, items: Array<{ productId: string; quantity: number }>) => {
    isLoading.value = true
    try {
      // Check stock first
      for (const item of items) {
        const prod = products.value.find((p) => p.id === item.productId)
        if (!prod || prod.stockQty < item.quantity) {
          return { success: false, message: `${prod?.name || 'Mahsulot'} zaxirada yetarli emas!` }
        }
      }

      // Subtract stock
      for (const item of items) {
        const prod = products.value.find((p) => p.id === item.productId)
        if (prod) prod.stockQty -= item.quantity
      }

      const newOrder: SalesOrder = {
        ...orderData,
        id: Math.random().toString(36).substring(2, 9),
        status: 'RECEIVED',
        createdAt: new Date().toISOString()
      }

      orders.value.push(newOrder)
      return { success: true, order: newOrder }
    } catch (error) {
      return { success: false, message: 'Buyurtma saqlashda xatolik' }
    } finally {
      isLoading.value = false
    }
  }

  // Shtrix-kod skanerlaganda mahsulotni aniqlash
  const scanBarcode = (barcode: string) => {
    const product = products.value.find((p) => p.barcode === barcode)
    if (product) {
      return { found: true, product }
    }
    return { found: false }
  }

  // Rassrochka moduli
  const createInstallment = async (orderId: string, total: number, months: number) => {
    const installment: Installment = {
      id: Math.random().toString(36).substring(2, 9),
      orderId,
      totalAmount: total,
      monthsCount: months,
      monthlyAmount: Math.round(total / months),
      nextPayDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false
    }
    installments.value.push(installment)
    return installment
  }

  // Buyurtma statusini yangilash: Qabul qilindi -> Qadoqlanmoqda -> Yo'lda -> Yetkazildi
  const updateOrderStatus = (orderId: string, status: DeliveryStatus) => {
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = status
    }
  }

  return {
    products,
    orders,
    installments,
    activeOrder,
    isLoading,
    stockAlertProducts,
    omnichannelInbox,
    fetchProducts,
    addProduct,
    createSalesOrder,
    scanBarcode,
    createInstallment,
    updateOrderStatus
  }
})
