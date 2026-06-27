import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import type { Product, Order, Category, CustomRequest } from './types'
import { initialProducts, categories as defaultCategories } from './products-data'

// In-memory storage for demo mode
let demoProducts: Product[] = initialProducts.map((p, i) => ({
  ...p,
  id: `demo-${i}`,
  createdAt: new Date(),
  updatedAt: new Date(),
}))

let demoCategories: Category[] = [...defaultCategories]
let demoOrders: Order[] = []
let demoCustomRequests: CustomRequest[] = []
let orderCounter = 1000

// Products
export async function getProducts(): Promise<Product[]> {
  if (!isFirebaseConfigured || !db) {
    return demoProducts
  }
  
  const productsRef = collection(db, 'products')
  const snapshot = await getDocs(query(productsRef, orderBy('name')))
  
  if (snapshot.empty) {
    await initializeProducts()
    return getProducts()
  }
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Product[]
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  if (!isFirebaseConfigured || !db) {
    return demoProducts.filter(p => p.category === categoryId)
  }
  
  const productsRef = collection(db, 'products')
  const q = query(productsRef, where('category', '==', categoryId), orderBy('name'))
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Product[]
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!isFirebaseConfigured || !db) {
    return demoProducts.find(p => p.id === id) || null
  }
  
  const docRef = doc(db, 'products', id)
  const snapshot = await getDoc(docRef)
  
  if (!snapshot.exists()) return null
  
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate() || new Date(),
    updatedAt: snapshot.data().updatedAt?.toDate() || new Date(),
  } as Product
}

export async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    const id = `demo-${Date.now()}`
    demoProducts.push({
      ...product,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return id
  }
  
try {
  const productsRef = collection(db, 'products')

  const docRef = await addDoc(productsRef, {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  console.log("✅ Product saved:", docRef.id)
  return docRef.id
} catch (error) {
  console.error("❌ addProduct failed:", error)
  throw error
}
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const index = demoProducts.findIndex(p => p.id === id)
    if (index !== -1) {
      demoProducts[index] = { ...demoProducts[index], ...data, updatedAt: new Date() }
    }
    return
  }
  
  const docRef = doc(db, 'products', id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    demoProducts = demoProducts.filter(p => p.id !== id)
    return
  }
  
  const docRef = doc(db, 'products', id)
  await deleteDoc(docRef)
}

// Categories
export async function getCategories(): Promise<Category[]> {
  if (!isFirebaseConfigured || !db) {
    return demoCategories
  }
  
  const categoriesRef = collection(db, 'categories')
  const snapshot = await getDocs(query(categoriesRef, orderBy('order')))
  
  if (snapshot.empty) {
    await initializeCategories()
    return getCategories()
  }
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[]
}

export async function addCategory(category: Omit<Category, 'id'>): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    const id = `cat-${Date.now()}`
    demoCategories.push({ ...category, id })
    return id
  }
  
  const categoriesRef = collection(db, 'categories')
  const docRef = await addDoc(categoriesRef, category)
  return docRef.id
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const index = demoCategories.findIndex(c => c.id === id)
    if (index !== -1) {
      demoCategories[index] = { ...demoCategories[index], ...data }
    }
    return
  }
  
  const docRef = doc(db, 'categories', id)
  await updateDoc(docRef, data)
}

export async function deleteCategory(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    demoCategories = demoCategories.filter(c => c.id !== id)
    return
  }
  
  const docRef = doc(db, 'categories', id)
  await deleteDoc(docRef)
}

// Orders
export async function getOrders(): Promise<Order[]> {
  if (!isFirebaseConfigured || !db) {
    return demoOrders
  }
  
  const ordersRef = collection(db, 'orders')
  const snapshot = await getDocs(query(ordersRef, orderBy('createdAt', 'desc')))
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Order[]
}

export async function getOrdersByStatus(status: Order['status']): Promise<Order[]> {
  if (!isFirebaseConfigured || !db) {
    return demoOrders.filter(o => o.status === status)
  }
  
  const ordersRef = collection(db, 'orders')
  const q = query(ordersRef, where('status', '==', status), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Order[]
}

export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    const id = `SSK${orderCounter++}`
    demoOrders.unshift({
      ...order,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return id
  }
  
  const ordersRef = collection(db, 'orders')
  const docRef = await addDoc(ordersRef, {
    ...order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const index = demoOrders.findIndex(o => o.id === id)
    if (index !== -1) {
      demoOrders[index] = { ...demoOrders[index], status, updatedAt: new Date() }
    }
    return
  }
  
  const docRef = doc(db, 'orders', id)
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  })
}

// Custom Requests
export async function getCustomRequests(): Promise<CustomRequest[]> {
  if (!isFirebaseConfigured || !db) {
    return demoCustomRequests
  }
  
  const requestsRef = collection(db, 'customRequests')
  const snapshot = await getDocs(query(requestsRef, orderBy('createdAt', 'desc')))
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as CustomRequest[]
}

export async function createCustomRequest(request: Omit<CustomRequest, 'id' | 'createdAt'>): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    const id = `req-${Date.now()}`
    demoCustomRequests.unshift({
      ...request,
      id,
      createdAt: new Date(),
    })
    return id
  }
  
  const requestsRef = collection(db, 'customRequests')
  const docRef = await addDoc(requestsRef, {
    ...request,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateCustomRequestStatus(id: string, status: CustomRequest['status']): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const index = demoCustomRequests.findIndex(r => r.id === id)
    if (index !== -1) {
      demoCustomRequests[index] = { ...demoCustomRequests[index], status }
    }
    return
  }
  
  const docRef = doc(db, 'customRequests', id)
  await updateDoc(docRef, { status })
}

// Initialize data
async function initializeProducts(): Promise<void> {
  if (!db) return
  
  const productsRef = collection(db, 'products')
  
  for (const product of initialProducts) {
    await addDoc(productsRef, {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }
}

async function initializeCategories(): Promise<void> {
  if (!db) return
  
  const categoriesRef = collection(db, 'categories')
  
  for (const category of defaultCategories) {
    await addDoc(categoriesRef, category)
  }
}
