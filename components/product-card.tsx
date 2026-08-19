'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/lib/types'
import { WEIGHT_OPTIONS, QUANTITY_OPTIONS } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Plus, ShoppingCart, Check } from 'lucide-react'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
}

const categoryEmojis: Record<string, string> = {
  'rice-grains': '🌾',
  'pulses-dal': '🫘',
  'spices': '🌶️',
  'oils': '🫒',
  'flour': '🌾',
  'sugar-salt': '🧂',
  'tea-coffee': '☕',
  'snacks': '🍪',
  'dairy': '🥛',
  'personal-care': '🧴',
  'cleaning': '🧹',
  'pooja': '🪔',
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedWeight, setSelectedWeight] = useState('')
  const [customQuantity, setCustomQuantity] = useState('')
  const [quantity, setQuantity] = useState(1)

  const isWeightBased = ['kg', 'litre'].includes(product.unit)
  const options = isWeightBased ? WEIGHT_OPTIONS : QUANTITY_OPTIONS

  const calculatePrice = () => {
    if (selectedWeight === 'custom') {
      const customValue = parseFloat(customQuantity) || 0
      if (isWeightBased) {
        return product.basePrice * customValue * quantity
      }
      return product.basePrice * customValue
    }
    
    const option = options.find((o) => o.value === selectedWeight)
    if (!option) return 0
    
    return product.basePrice * option.multiplier * quantity
  }

  const getWeightLabel = () => {
    if (selectedWeight === 'custom') {
      if (isWeightBased) {
        return `${customQuantity || '0'} kg x ${quantity}`
      }
      return `${customQuantity || '0'} pcs`
    }
    
    const option = options.find((o) => o.value === selectedWeight)
    if (!option) return ''
    
    return `${option.label} x ${quantity}`
  }

  const handleAddToCart = () => {
    if (!selectedWeight) {
      toast.error('Please select a quantity')
      return
    }
    
    if (selectedWeight === 'custom' && (!customQuantity || parseFloat(customQuantity) <= 0)) {
      toast.error('Please enter a valid quantity')
      return
    }

    const totalPrice = calculatePrice()
    const weightLabel = getWeightLabel()
    
    addItem(product, weightLabel, quantity, totalPrice)
    toast.success(`Added ${product.name} to cart`)
    setDialogOpen(false)
    setSelectedWeight('')
    setCustomQuantity('')
    setQuantity(1)
  }

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50">
        <div 
          className="relative aspect-square bg-secondary/30 flex items-center justify-center cursor-pointer"
          onClick={() => setDialogOpen(true)}
        >
          {product.image ? (
  <img
    src={product.image}
    alt={product.name}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  />
) : (
  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
    {categoryEmojis[product.category] || '📦'}
  </span>
)}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-sm font-medium text-destructive">Out of Stock</span>
            </div>
          )}
        </div>
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-1 mb-3">
            <h3 className="font-semibold text-sm sm:text-base line-clamp-1 text-balance">
              {product.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground telugu line-clamp-1">
              {product.nameTelugu}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base sm:text-lg font-bold text-primary">
                Rs. {product.basePrice}
              </p>
              <p className="text-xs text-muted-foreground">per {product.unit}</p>
            </div>
            <Button
              size="sm"
              onClick={() => setDialogOpen(true)}
              disabled={!product.inStock}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-3xl">{categoryEmojis[product.category] || '📦'}</span>
              <div>
                <p>{product.name}</p>
                <p className="text-sm font-normal text-muted-foreground telugu">
                  {product.nameTelugu}
                </p>
              </div>
            </DialogTitle>
            <DialogDescription>
              Rs. {product.basePrice} per {product.unit}
              {product.description && ` - ${product.description}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Select {isWeightBased ? 'Weight' : 'Quantity'}
              </Label>
              <RadioGroup
                value={selectedWeight}
                onValueChange={setSelectedWeight}
                className="grid grid-cols-3 gap-2"
              >
                {options.map((option) => (
                  <div key={option.value}>
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={option.value}
                      className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-2.5 text-sm hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-colors"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {selectedWeight === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="custom-qty">
                  Enter {isWeightBased ? 'weight in kg' : 'number of pieces'}
                </Label>
                <Input
                  id="custom-qty"
                  type="number"
                  min="0"
                  step={isWeightBased ? '0.1' : '1'}
                  placeholder={isWeightBased ? 'e.g., 0.5, 1.5, 3' : 'e.g., 4, 6, 12'}
                  value={customQuantity}
                  onChange={(e) => setCustomQuantity(e.target.value)}
                />
              </div>
            )}

            {selectedWeight && selectedWeight !== 'custom' && (
              <div className="space-y-2">
                <Label>How many packs?</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

            {selectedWeight && (
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="text-sm text-muted-foreground">{getWeightLabel()}</p>
                </div>
                <p className="text-2xl font-bold text-primary">
                  Rs. {calculatePrice().toFixed(0)}
                </p>
              </div>
            )}
          </div>

          <Button onClick={handleAddToCart} className="w-full gap-2" size="lg">
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
