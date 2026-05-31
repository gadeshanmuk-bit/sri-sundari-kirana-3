'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { createOrder } from '@/lib/firebase-db'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ShoppingCart,
  Truck,
  Phone,
  MapPin,
  CheckCircle,
  Banknote,
  Clock,
  User,
  FileText,
  Home,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

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

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalAmount, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    orderNotes: '',
    paymentMethod: 'cod',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required'
    } else if (formData.address.trim().length < 20) {
      newErrors.address = 'Please enter a complete address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly')
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)

    try {
      const id = await createOrder({
        customerName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim(),
  orderNotes: formData.orderNotes?.trim() || '',
        items,
        totalAmount,
        status: 'pending',
        paymentMethod: 'cod',
      })

      setOrderId(id)
      setOrderPlaced(true)
      clearCart()
      toast.success('Order placed successfully!')
      const whatsappMessage = `New Order - Sri Sundari Kirana

Customer: ${formData.fullName}
Phone: ${formData.phoneNumber}
Address: ${formData.address}

Items:
${items.map(item => `${item.product?.name || 'Unknown Item'} x ${item.quantity}`).join('\n')}
Total: ₹${totalAmount}

Notes: ${formData.orderNotes || 'None'}`
window.open(`https://wa.me/918309606916?text=${encodeURIComponent(whatsappMessage)}`)
    } catch (error) {
      console.error('Order creation failed:', error)
      toast.error('Failed to place order. Please try calling us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="bg-accent/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-accent" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. We will contact you shortly to confirm delivery.
            </p>
            
            <Card className="mb-6 text-left">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono text-sm">{orderId.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-semibold text-primary">Rs. {totalAmount.toFixed(0)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                For any queries, contact us at:
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="tel:8309606916"
                  className="flex items-center justify-center gap-2 text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  8309606916
                </a>
                <a
                  href="tel:9542549956"
                  className="flex items-center justify-center gap-2 text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  9542549956
                </a>
              </div>
            </div>

            <div className="mt-8">
              <Button asChild size="lg" className="w-full">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="max-w-md mx-auto px-4 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Add some items to your cart to proceed with checkout.
            </p>
            <Button asChild size="lg">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Browse Products
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Continue Shopping
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Delivery Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5 text-primary" />
                      Delivery Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className={errors.fullName ? 'border-destructive' : ''}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Enter your 10-digit phone number"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                        className={errors.phoneNumber ? 'border-destructive' : ''}
                      />
                      {errors.phoneNumber && (
                        <p className="text-sm text-destructive">{errors.phoneNumber}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter complete address including house/flat number, street, landmark, area, city"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        rows={3}
                        className={errors.address ? 'border-destructive' : ''}
                      />
                      {errors.address && (
                        <p className="text-sm text-destructive">{errors.address}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                      <Textarea
                        id="orderNotes"
                        placeholder="Any special instructions for your order or delivery"
                        value={formData.orderNotes}
                        onChange={(e) =>
                          setFormData({ ...formData, orderNotes: e.target.value })
                        }
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Banknote className="h-5 w-5 text-primary" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) =>
                        setFormData({ ...formData, paymentMethod: value })
                      }
                    >
                      <div className="flex items-center space-x-3 p-4 border border-primary rounded-lg bg-primary/5">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label
                          htmlFor="cod"
                          className="flex-1 cursor-pointer flex items-center gap-3"
                        >
                          <Banknote className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">
                              Pay when you receive your order
                            </p>
                          </div>
                        </Label>
                        <Badge variant="secondary">Only Option</Badge>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Submit Button - Mobile */}
                <div className="lg:hidden">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Place Order - Rs. {totalAmount.toFixed(0)}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {items.map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedWeight}`}
                        className="flex gap-3 p-2 bg-secondary/50 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center shrink-0">
                          <span className="text-lg">
                            {categoryEmojis[item.product.category] || '📦'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.selectedWeight} x {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          Rs. {item.totalPrice.toFixed(0)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>Rs. {totalAmount.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="text-accent font-medium">FREE</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">Rs. {totalAmount.toFixed(0)}</span>
                  </div>

                  {/* Submit Button - Desktop */}
                  <div className="hidden lg:block pt-2">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={loading}
                      onClick={handleSubmit}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Place Order
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Truck className="h-3 w-3" />
                      <span>Free home delivery in Rajamahendravaram</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Delivery within 2-4 hours</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3 mt-0.5" />
                      <span>
                        Questions? Call{' '}
                        <a href="tel:8309606916" className="text-primary hover:underline">
                          8309606916
                        </a>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
