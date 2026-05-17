'use client'

import { useState, useMemo, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { CustomRequestDialog } from '@/components/custom-request-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { initialProducts, categories } from '@/lib/products-data'
import type { Product, Category } from '@/lib/types'
import {
  Truck,
  Phone,
  Clock,
  MapPin,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Star,
} from 'lucide-react'

const categoryIcons: Record<string, string> = {
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

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Transform initial products with IDs
    const productsWithIds = initialProducts.map((product, index) => ({
      ...product,
      id: `product-${index}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
    setProducts(productsWithIds)
    setLoading(false)
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = products

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.nameTelugu.includes(query) ||
          p.category.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [products, selectedCategory, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setSelectedCategory(null)
    if (query) {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
    setSearchQuery('')
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} searchQuery={searchQuery} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    Trusted Local Store
                  </Badge>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance leading-tight">
                    Welcome to{' '}
                    <span className="text-primary">Sri Sundari</span>
                    <br />
                    Kirana & General Stores
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-xl text-pretty">
                    Your neighborhood grocery store in Rajamahendravaram. 
                    Quality products, fair prices, and doorstep delivery.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Truck className="h-4 w-4 text-primary" />
                    </div>
                    <span>Home Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <span>8 AM - 10 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                    </div>
                    <span>Cash on Delivery</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    onClick={() =>
                      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="gap-2"
                  >
                    Shop Now
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="tel:8309606916" className="gap-2">
                      <Phone className="h-4 w-4" />
                      Call to Order
                    </a>
                  </Button>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative">
                  <div className="grid grid-cols-3 gap-4">
                    {['🌾', '🫘', '🌶️', '☕', '🥛', '🪔'].map((emoji, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-card rounded-2xl shadow-lg flex items-center justify-center text-5xl hover:scale-105 transition-transform"
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    Fresh Groceries Daily
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Banner */}
        <section className="bg-accent text-accent-foreground py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>SVG Market, KMR Complex, 2nd Gate, Rajamahendravaram</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:8309606916" className="hover:underline">
                  8309606916
                </a>
                <span>/</span>
                <a href="tel:9542549956" className="hover:underline">
                  9542549956
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="py-10 sm:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Shop by Category</h2>
              {selectedCategory && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
                  Clear filter
                </Button>
              )}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                      : 'bg-card hover:bg-secondary border border-border hover:border-primary/30'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl mb-1">
                    {categoryIcons[category.id] || '📦'}
                  </span>
                  <span className="text-xs text-center line-clamp-2 leading-tight">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="py-10 sm:py-12 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {selectedCategory
                    ? categories.find((c) => c.id === selectedCategory)?.name || 'Products'
                    : searchQuery
                    ? 'Search Results'
                    : 'All Products'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}{' '}
                  {searchQuery && `for "${searchQuery}"`}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="aspect-square" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  {"We couldn't find what you're looking for."}
                </p>
                <CustomRequestDialog />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Custom Request */}
            <div className="mt-10 max-w-md mx-auto">
              <CustomRequestDialog />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-10 sm:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">Why Choose Us?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Sparkles className="h-6 w-6" />,
                  title: 'Quality Products',
                  titleTelugu: 'నాణ్యమైన ఉత్పత్తులు',
                  description: 'Fresh and quality groceries at fair prices',
                },
                {
                  icon: <Truck className="h-6 w-6" />,
                  title: 'Home Delivery',
                  titleTelugu: 'ఇంటికి డెలివరీ',
                  description: 'Free delivery to your doorstep in Rajamahendravaram',
                },
                {
                  icon: <ShoppingBag className="h-6 w-6" />,
                  title: 'Cash on Delivery',
                  titleTelugu: 'డెలివరీ వద్ద నగదు',
                  description: 'Pay when you receive your order',
                },
                {
                  icon: <Phone className="h-6 w-6" />,
                  title: 'Easy Ordering',
                  titleTelugu: 'సులభమైన ఆర్డరింగ్',
                  description: 'Order online or call us directly',
                },
              ].map((feature, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground telugu mb-2">{feature.titleTelugu}</p>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-10 sm:py-12 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">Visit Our Store</h2>
            <p className="text-center text-muted-foreground mb-8">
              SVG Market, KMR Complex, 2nd Gate, Rajamahendravaram, Andhra Pradesh
            </p>
            <div className="aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3815.8271889853814!2d81.7788889!3d17.0052778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37a18e2b0a1a1b%3A0x8b1b8b8b8b8b8b8b!2sRajamahendravaram%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Store Location"
              />
            </div>
            <div className="mt-6 text-center">
              <Button asChild>
                <a
                  href="https://maps.google.com/?q=Sri+Sundari+Kirana+General+Stores+SVG+Market+KMR+Complex+2nd+Gate+Rajamahendravaram+Andhra+Pradesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Get Directions
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
