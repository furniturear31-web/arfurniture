import Link from 'next/link'
import { CheckCircle, MessageCircle } from 'lucide-react'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const orderId = params.order as string

  const whatsappMessage = encodeURIComponent(`Hello AR Furniture! I have just made a payment. My Order Reference ID is: ${orderId}. Please confirm my order.`)
  const whatsappLink = `https://wa.me/918511939151?text=${whatsappMessage}`

  return (
    <div className="bg-zinc-50 py-16 md:py-24 min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 text-center">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Payment Successful!</h1>
        <p className="text-zinc-600 mb-8">
          Thank you for your purchase. Your payment has been received securely.
        </p>
        
        {orderId && (
          <div className="bg-white p-6 rounded-lg border-2 border-dashed border-amber-300 mb-8 shadow-sm">
            <p className="text-sm text-zinc-500 mb-2 uppercase tracking-wider font-semibold">Your Order ID</p>
            <p className="font-mono font-bold text-xl text-zinc-900 mb-4">{orderId}</p>
            
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <p className="text-sm text-green-800 font-medium mb-3">
                ⚠️ Important: Please share this Order ID with us on WhatsApp to confirm your delivery details.
              </p>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-all shadow-md hover:-translate-y-1">
                <MessageCircle className="mr-2 h-5 w-5" />
                Share Order on WhatsApp
              </a>
            </div>
          </div>
        )}

        <div className="space-y-4 mt-8 pt-6 border-t border-zinc-200">
          <Link href="/shop" className="block w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 rounded-md transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
