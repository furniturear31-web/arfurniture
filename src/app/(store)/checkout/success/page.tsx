import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const orderId = searchParams.order

  return (
    <div className="bg-zinc-50 py-24 min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 text-center">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">Order Confirmed!</h1>
        <p className="text-zinc-600 mb-8">
          Thank you for your purchase. Your payment was successful and we are processing your order.
        </p>
        
        {orderId && (
          <div className="bg-white p-4 rounded-md border border-zinc-200 mb-8">
            <p className="text-sm text-zinc-500 mb-1">Order Reference ID</p>
            <p className="font-mono font-medium text-zinc-900">{orderId}</p>
          </div>
        )}

        <div className="space-y-4">
          <Link href="/shop" className="block w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 rounded-md transition-colors">
            Continue Shopping
          </Link>
          <a href="https://wa.me/918511939151" target="_blank" rel="noopener noreferrer" className="block w-full bg-green-50 text-green-700 font-semibold py-3 rounded-md border border-green-200 hover:bg-green-100 transition-colors">
            Contact Support on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
