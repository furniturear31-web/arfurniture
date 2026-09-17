'use server'

import { createClient } from '@/lib/supabase/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function createOrder(formData: FormData) {
  const supabase = await createClient()

  const productId = formData.get('productId') as string
  const customerName = formData.get('customerName') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  // Fetch product to get exact price
  const { data: product } = await supabase.from('products').select('*').eq('id', productId).single()
  
  if (!product || !product.price) {
    return { error: 'Invalid product or price not found' }
  }

  const amount = product.price

  // Create Razorpay order
  try {
    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    }
    const rzpOrder = await razorpay.orders.create(options)

    // Create record in Supabase orders table
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_name: customerName,
        phone,
        whatsapp_number: phone,
        address,
        total_amount: amount,
        payment_status: 'PENDING',
        razorpay_order_id: rzpOrder.id
      }])
      .select()
      .single()

    if (orderError || !order) {
      return { error: 'Failed to create order record' }
    }

    // Add order item
    await supabase.from('order_items').insert([{
      order_id: order.id,
      product_id: product.id,
      quantity: 1,
      price_at_time: amount
    }])

    return { 
      success: true, 
      orderId: rzpOrder.id,
      dbOrderId: order.id,
      amount: options.amount,
      keyId: process.env.RAZORPAY_KEY_ID
    }
  } catch (error: any) {
    console.error("Razorpay Error:", error)
    return { error: error.message || 'Payment initiation failed' }
  }
}

export async function verifyPayment(
  razorpay_payment_id: string,
  razorpay_order_id: string,
  razorpay_signature: string,
  dbOrderId: string
) {
  const supabase = await createClient()

  const sign = razorpay_order_id + "|" + razorpay_payment_id
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(sign.toString())
    .digest("hex")

  if (razorpay_signature === expectedSign) {
    // Payment verified
    await supabase.from('orders').update({
      payment_status: 'PAID',
      razorpay_payment_id,
      status: 'CONFIRMED'
    }).eq('id', dbOrderId)

    return { success: true }
  } else {
    // Payment verification failed
    return { error: 'Invalid payment signature' }
  }
}
