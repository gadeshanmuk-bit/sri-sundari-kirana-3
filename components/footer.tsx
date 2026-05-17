import Link from 'next/link'
import { Phone, Clock, MapPin, Mail, Truck } from 'lucide-react'

export function Footer() {
  return (
    <footer id="contact" className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-primary-foreground">Sri Sundari</h3>
              <p className="text-sm text-muted">Kirana & General Stores</p>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Your trusted neighborhood grocery store in Rajamahendravaram. 
              Quality products, fair prices, and home delivery service since generations.
            </p>
            <div className="flex items-center gap-2 text-primary-foreground">
              <Truck className="h-5 w-5" />
              <span className="font-medium">Home Delivery Available</span>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact Us</h4>
            <div className="space-y-3">
              <a
                href="tel:8309606916"
                className="flex items-center gap-3 text-sm text-muted hover:text-background transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" />
                <span>8309606916</span>
              </a>
              <a
                href="tel:9542549956"
                className="flex items-center gap-3 text-sm text-muted hover:text-background transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" />
                <span>9542549956</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-muted">
                <Clock className="h-4 w-4 shrink-0" />
                <span>8:00 AM - 10:00 PM (All Days)</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Our Location</h4>
            <div className="flex items-start gap-3 text-sm text-muted">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p>SVG Market, KMR Complex,</p>
                <p>2nd Gate, Rajamahendravaram,</p>
                <p>Andhra Pradesh, India</p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Sri+Sundari+Kirana+General+Stores+SVG+Market+KMR+Complex+Rajamahendravaram"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary-foreground hover:underline"
            >
              <MapPin className="h-4 w-4" />
              View on Google Maps
            </a>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-muted hover:text-background transition-colors"
              >
                Home
              </Link>
              <Link
                href="/#categories"
                className="text-sm text-muted hover:text-background transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/#products"
                className="text-sm text-muted hover:text-background transition-colors"
              >
                All Products
              </Link>
              <Link
                href="/checkout"
                className="text-sm text-muted hover:text-background transition-colors"
              >
                Checkout
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-muted/20 mt-8 pt-8 text-center">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Sri Sundari Kirana & General Stores. All rights reserved.
          </p>
          <p className="text-xs text-muted/60 mt-2">
            Serving Rajamahendravaram with quality groceries
          </p>
        </div>
      </div>
    </footer>
  )
}
