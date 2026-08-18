'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HelpCircle, Send, CheckCircle } from 'lucide-react';
import { createCustomRequest } from '@/lib/firebase-db';
import { toast } from 'sonner';

export function CustomRequestDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    itemDescription: '',
    quantity: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customerName || !formData.phoneNumber || !formData.itemDescription) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      await createCustomRequest({
        ...formData,
        status: 'pending',
      })
      setSubmitted(true)
      toast.success('Request submitted! We will contact you soon.')
    } catch (error) {
      toast.error('Failed to submit request. Please call us directly.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        customerName: '',
        phoneNumber: '',
        itemDescription: '',
        quantity: '',
      })
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2" size="lg">
          <HelpCircle className="h-5 w-5" />
          {"Can't find your item?"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Request Submitted!</h3>
            <p className="text-muted-foreground mb-6">
              We will contact you shortly regarding your request.
            </p>
            <Button onClick={handleClose}>Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Request an Item</DialogTitle>
              <DialogDescription>
                {"Can't find what you're looking for? Tell us and we'll arrange it for you!"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="item">Item Description *</Label>
                <Textarea
                  id="item"
                  placeholder="Describe the item you need (brand, type, size, etc.)"
                  value={formData.itemDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, itemDescription: e.target.value })
                  }
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qty">Quantity (Optional)</Label>
                <Input
                  id="qty"
                  placeholder="e.g., 2 kg, 5 packets, etc."
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                <Send className="h-4 w-4" />
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
