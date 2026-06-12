import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type TableStatus = 'VACANT' | 'OCCUPIED' | 'RESERVED' | 'PAYMENT_PENDING'

export interface RestaurantTable {
  id: string
  tableNo: number
  capacity: number
  status: TableStatus
  orderTime?: string
  totalBill: number
  activeOrderId?: string
}

export interface MenuItem {
  id: string
  categoryId: string
  name: string
  price: number
  isAvailable: boolean
}

export interface Employee {
  id: string
  name: string
  email: string
  role: string
  status: 'ACTIVE' | 'INACTIVE'
}

export interface WarehouseItem {
  id: string
  name: string
  unit: string
  currentQty: number
  minimumQty: number
}

export interface Supplier {
  id: string
  name: string
  phone: string
  balance: number
}

export interface Expense {
  id: string
  amount: number
  description: string
  expenseDate: string
  categoryId: string
}

export interface Receipt {
  id: string
  orderId?: string
  totalAmount: number
  paymentType: 'CASH' | 'CARD' | 'MIXED'
  cashAmount: number
  cardAmount: number
  createdAt: string
}

export const useRestaurantStore = defineStore('restaurant', () => {
  // 12 ta stollarni boshlang'ich sozlash
  const tables = ref<RestaurantTable[]>([])
  const menuItems = ref<MenuItem[]>([])
  const employees = ref<Employee[]>([])
  const warehouse = ref<WarehouseItem[]>([])
  const suppliers = ref<Supplier[]>([])
  const expenses = ref<Expense[]>([])
  const receipts = ref<Receipt[]>([])
  const isLoading = ref(false)

  // Getters
  const tableCount = computed(() => tables.value.length)
  
  // Real-time stollar statistika
  const occupiedTablesCount = computed(() => {
    return tables.value.filter((t) => t.status === 'OCCUPIED').length
  })

  // Tugayotgan mahsulotlar ogohlantirishlari
  const warehouseAlerts = computed(() => {
    return warehouse.value.filter((item) => item.currentQty <= item.minimumQty)
  })

  // Moliya ko'rsatkichlari
  const totalIncome = computed(() => {
    return receipts.value.reduce((sum, r) => sum + r.totalAmount, 0)
  })

  const totalExpenses = computed(() => {
    return expenses.value.reduce((sum, e) => sum + e.amount, 0)
  })

  const netProfit = computed(() => {
    return totalIncome.value - totalExpenses.value
  })

  // Actions
  const initTables = () => {
    // 12 ta stol hosil qilish
    if (tables.value.length === 0) {
      tables.value = Array.from({ length: 12 }, (_, i) => ({
        id: `table-uuid-${i + 1}`,
        tableNo: i + 1,
        capacity: 4,
        status: 'VACANT',
        totalBill: 0
      }))
    }
  }

  // Websocket orqali stol statusi yangilanganda ishlatiladi
  const updateTableStatusFromSocket = (data: { tableNo: number; status: TableStatus; bill?: number; orderTime?: string }) => {
    const table = tables.value.find((t) => t.tableNo === data.tableNo)
    if (table) {
      table.status = data.status
      if (data.bill !== undefined) table.totalBill = data.bill
      if (data.orderTime !== undefined) table.orderTime = data.orderTime
    }
  }

  const fetchMenu = async () => {
    menuItems.value = [
      { id: 'menu-1', categoryId: 'cat-1', name: 'Palov', price: 35000, isAvailable: true },
      { id: 'menu-2', categoryId: 'cat-1', name: 'Manti', price: 6000, isAvailable: true }
    ]
  }

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    // Expense verification: description, amount, categoryId, expenseDate are mandatory
    if (!expense.description || !expense.amount || !expense.categoryId || !expense.expenseDate) {
      return { success: false, message: 'Barcha maydonlarni toʻldirish majburiy!' }
    }
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substring(2, 9)
    }
    expenses.value.push(newExpense)
    return { success: true }
  }

  const processTablePayment = async (tableNo: number, paymentType: 'CASH' | 'CARD' | 'MIXED', cash = 0, card = 0) => {
    const table = tables.value.find((t) => t.tableNo === tableNo)
    if (!table || table.totalBill === 0) return { success: false }

    const newReceipt: Receipt = {
      id: Math.random().toString(36).substring(2, 9),
      totalAmount: table.totalBill,
      paymentType,
      cashAmount: paymentType === 'MIXED' ? cash : (paymentType === 'CASH' ? table.totalBill : 0),
      cardAmount: paymentType === 'MIXED' ? card : (paymentType === 'CARD' ? table.totalBill : 0),
      createdAt: new Date().toISOString()
    }

    receipts.value.push(newReceipt)

    // Stolni bo'shatish
    table.status = 'VACANT'
    table.totalBill = 0
    table.orderTime = undefined
    
    return { success: true, receipt: newReceipt }
  }

  return {
    tables,
    menuItems,
    employees,
    warehouse,
    suppliers,
    expenses,
    receipts,
    isLoading,
    tableCount,
    occupiedTablesCount,
    warehouseAlerts,
    totalIncome,
    totalExpenses,
    netProfit,
    initTables,
    updateTableStatusFromSocket,
    fetchMenu,
    addExpense,
    processTablePayment
  }
})
