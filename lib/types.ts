export interface Product {
  id: string
  name: string
  nameTelugu: string
  category: string
  basePrice: number
  unit: string
  image: string
  inStock: boolean
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  product: Product
  quantity: number
  selectedWeight: string
  totalPrice: number
}

export interface Order {
  id: string
  customerName: string
  phoneNumber: string
  address: string
  orderNotes?: string
  items: CartItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'delivered'
  paymentMethod: 'cod'
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  nameTelugu: string
  icon: string
  order: number
}

export interface CustomRequest {
  id: string
  customerName: string
  phoneNumber: string
  itemDescription: string
  quantity?: string
  status: 'pending' | 'contacted' | 'fulfilled'
  createdAt: Date
}

export const WEIGHT_OPTIONS = [
  { label: '100g', value: '100g', multiplier: 0.1 },
  { label: '250g', value: '250g', multiplier: 0.25 },
  { label: '500g', value: '500g', multiplier: 0.5 },
  { label: '1 kg', value: '1kg', multiplier: 1 },
  { label: '2 kg', value: '2kg', multiplier: 2 },
  { label: 'Custom', value: 'custom', multiplier: 1 },
]

export const QUANTITY_OPTIONS = [
  { label: '1 pc', value: '1pc', multiplier: 1 },
  { label: '2 pcs', value: '2pcs', multiplier: 2 },
  { label: '3 pcs', value: '3pcs', multiplier: 3 },
  { label: '5 pcs', value: '5pcs', multiplier: 5 },
  { label: '10 pcs', value: '10pcs', multiplier: 10 },
  { label: 'Custom', value: 'custom', multiplier: 1 },
]
