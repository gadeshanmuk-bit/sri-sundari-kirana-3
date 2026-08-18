'use client';
import { useState } from 'react';
 import Link from'next/link';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Menu, Phone, Clock, MapPin, Truck, Plus, Minus, Trash2,  } from 'lucide-react';

interface HeaderProps {
  onSearch?: (query: string) => void
  searchQuery?: string
}

export function Header({ onSearch, searchQuery = '' }: HeaderProps) {
  const { items, totalItems, totalAmount, removeItem, updateQuantity } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchQuery)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(localSearch)
  }

  return (
    <header className="sticky top-0 z-50 bg-card shadow-sm border-b border-border">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Truck className="h-4 w-4" />
              <span className="font-medium">Home Delivery Available</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>8 AM - 10 PM</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:8309606916" className="flex items-center gap-1.5 hover:underline">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">8309606916</span>
            </a>
            <a href="tel:9542549956" className="flex items-center gap-1.5 hover:underline">
              <span className="hidden sm:inline">9542549956</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                <Link
                  href="/"
                  className="px-4 py-2 hover:bg-secondary rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/#categories"
                  className="px-4 py-2 hover:bg-secondary rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  href="/#products"
                  className="px-4 py-2 hover:bg-secondary rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                <Link
                  href="/#contact"
                  className="px-4 py-2 hover:bg-secondary rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
                <div className="border-t border-border my-4" />
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    <span>8 AM - 10 PM</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4" />
                    <span>8309606916</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>SVG Market, KMR Complex, 2nd Gate, Rajamahendravaram</span>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-primary leading-tight">
              Sri Sundari
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground leading-tight">
              Kirana & General Stores
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for groceries..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10 pr-4 w-full"
              />
            </div>
          </form>

          {/* Cart */}
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Your Cart ({totalItems} items)
                </SheetTitle>
              </SheetHeader>

              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add some groceries to get started
                  </p>
                  <Button onClick={() => setCartOpen(false)}>Continue Shopping</Button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {items.map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedWeight}`}
                        className="flex gap-3 p-3 bg-secondary/50 rounded-lg"
                      >
                        <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center shrink-0">
                          <span className="text-2xl">
                            {item.product.category === 'rice-grains' ? '🌾' :
                             item.product.category === 'pulses-dal' ? '🫘' :
                             item.product.category === 'spices' ? '🌶️' :
                             item.product.category === 'oils' ? '🫒' :
                             item.product.category === 'flour' ? '🌾' :
                             item.product.category === 'sugar-salt' ? '🧂' :
                             item.product.category === 'tea-coffee' ? '☕' :
                             item.product.category === 'snacks' ? '🍪' :
                             item.product.category === 'dairy' ? '🥛' :
                             item.product.category === 'personal-care' ? '🧴' :
                             item.product.category === 'cleaning' ? '🧹' :
                             item.product.category === 'pooja' ? '🪔' : '📦'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground telugu truncate">
                            {item.product.nameTelugu}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.selectedWeight}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    const newPrice = (item.totalPrice / item.quantity) * (item.quantity - 1)
                                    updateQuantity(item.product.id, item.selectedWeight, item.quantity - 1, newPrice)
                                  }
                                }}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  const newPrice = (item.totalPrice / item.quantity) * (item.quantity + 1)
                                  updateQuantity(item.product.id, item.selectedWeight, item.quantity + 1, newPrice)
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">
                                Rs. {item.totalPrice.toFixed(0)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                                onClick={() => removeItem(item.product.id, item.selectedWeight)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>Rs. {totalAmount.toFixed(0)}</span>
                    </div>
                    <Link href="/checkout" onClick={() => setCartOpen(false)}>
                      <Button className="w-full" size="lg">
                        Proceed to Checkout
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="mt-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for groceries..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 pr-4 w-full"
            />
          </div>
        </form>
      </div>
    </header>
  )
}
