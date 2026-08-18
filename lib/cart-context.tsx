'use client';
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { CartItem, Product } from '@/lib/types';

interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; selectedWeight: string; quantity: number; totalPrice: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; selectedWeight: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; selectedWeight: string; quantity: number; totalPrice: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState }

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
}

function calculateTotals(items: CartItem[]): { totalItems: number; totalAmount: number } {
  return items.reduce(
    (acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalAmount: acc.totalAmount + item.totalPrice,
    }),
    { totalItems: 0, totalAmount: 0 }
  )
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.payload.product.id && item.selectedWeight === action.payload.selectedWeight
      )

      let newItems: CartItem[]
      if (existingIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                quantity: item.quantity + action.payload.quantity,
                totalPrice: item.totalPrice + action.payload.totalPrice,
              }
            : item
        )
      } else {
        newItems = [
          ...state.items,
          {
            product: action.payload.product,
            quantity: action.payload.quantity,
            selectedWeight: action.payload.selectedWeight,
            totalPrice: action.payload.totalPrice,
          },
        ]
      }

      const totals = calculateTotals(newItems)
      return { items: newItems, ...totals }
    }

    case 'REMOVE_ITEM': {
      let newItems = state.items.filter(
        (item) => !(item.product.id === action.payload.productId && item.selectedWeight === action.payload.selectedWeight)
      )
      const totals = calculateTotals(newItems)
      return { items: newItems, ...totals }
    }

    case 'UPDATE_QUANTITY': {
      let newItems = state.items.map((item) =>
        item.product.id === action.payload.productId && item.selectedWeight === action.payload.selectedWeight
          ? { ...item, quantity: action.payload.quantity, totalPrice: action.payload.totalPrice }
          : item
      )
      const totals = calculateTotals(newItems)
      return { items: newItems, ...totals }
    }

    case 'CLEAR_CART':
      return initialState

    case 'LOAD_CART':
      return action.payload

    default:
      return state
  }
}

interface CartContextType extends CartState {
  addItem: (product: Product, selectedWeight: string, quantity: number, totalPrice: number) => void
  removeItem: (productId: string, selectedWeight: string) => void
  updateQuantity: (productId: string, selectedWeight: string, quantity: number, totalPrice: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    const savedCart = localStorage.getItem('sundari-cart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsed })
      } catch {
        // Invalid cart data, ignore
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sundari-cart', JSON.stringify(state))
  }, [state])

  const addItem = (product: Product, selectedWeight: string, quantity: number, totalPrice: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, selectedWeight, quantity, totalPrice } })
  }

  const removeItem = (productId: string, selectedWeight: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, selectedWeight } })
  }

  const updateQuantity = (productId: string, selectedWeight: string, quantity: number, totalPrice: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, selectedWeight, quantity, totalPrice } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
