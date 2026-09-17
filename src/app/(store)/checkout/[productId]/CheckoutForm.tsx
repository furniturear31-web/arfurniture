'use client'

import { useState } from 'react'
import { createOrder, verifyPayment } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

export function CheckoutForm({ product }: { product: any }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    
    const formData = new FormData(event.currentTarget)
    formData.append('productId', product.id)

    const orderResult = await createOrder(formData)

    if (orderResult.error) {
      alert(orderResult.error)
      setLoading(false)
      return
    }

    // Load Razorpay script dynamically
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
    
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?')
      setLoading(false)
      return
    }

    const options = {
      key: orderResult.keyId,
      amount: orderResult.amount,
      currency: "INR",
      name: "AR FURNITURE",
      description: `Purchase of ${product.name}`,
      order_id: orderResult.orderId,
      handler: async function (response: any) {
        // Verify payment
        const verifyResult = await verifyPayment(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature,
          orderResult.dbOrderId
        )

        if (verifyResult.success) {
          router.push(`/checkout/success?order=${orderResult.dbOrderId}`)
        } else {
          alert('Payment verification failed.')
          setLoading(false)
        }
      },
      prefill: {
        name: formData.get('customerName') as string,
        contact: formData.get('phone') as string,
      },
      theme: {
        color: "#d97706", // amber-600
      },
      modal: {
        ondismiss: function() {
          setLoading(false)
        }
      }
    }

    const paymentObject = new (window as any).Razorpay(options)
    paymentObject.open()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="customerName">Full Name</Label>
        <Input id="customerName" name="customerName" required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone / WhatsApp Number</Label>
        <Input id="phone" name="phone" type="tel" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Delivery Address</Label>
        <Textarea id="address" name="address" required rows={4} />
      </div>

      <Button type="submit" disabled={loading} className="w-full h-12 text-lg">
        {loading ? 'Processing...' : `Pay ₹${product.price?.toLocaleString('en-IN')}`}
      </Button>
    </form>
  )
}

function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}
