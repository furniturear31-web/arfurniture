export const metadata = {
  title: 'Refund & Cancellation Policy | AR FURNITURE',
}

export default function RefundPolicyPage() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-8">Cancellation & Refund Policy</h1>
        
        <div className="prose prose-zinc max-w-none text-zinc-700 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">1. Order Cancellation</h2>
          <p><strong>Standard Orders:</strong> You may cancel your standard furniture order within 24 hours of placement for a full refund. Cancellations made after 24 hours may be subject to a 10% restocking fee if the item has already been prepared for shipping.</p>
          <p><strong>Custom Orders:</strong> Custom-made or personalized furniture orders cannot be cancelled once production has commenced. The advance payment for custom orders is non-refundable.</p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">2. Returns and Refunds</h2>
          <p>We take pride in the quality of our handcrafted furniture. However, if you are not entirely satisfied with your purchase, we're here to help.</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>You have 7 calendar days to return an item from the date you received it.</li>
            <li>To be eligible for a return, your item must be unused, in the same condition that you received it, and in the original packaging.</li>
            <li>Custom-made items, discounted items, or clearance items are not eligible for returns.</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">3. Damage During Transit</h2>
          <p>If your furniture arrives damaged or defective, please notify us within 24 hours of delivery. Please provide clear photographs of the damage. We will arrange for a repair, replacement, or refund at our discretion, at no additional cost to you.</p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">4. Refund Process</h2>
          <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.</p>
          <p>If your return is approved, we will initiate a refund to your credit card (or original method of payment via Razorpay). You will receive the credit within 5-7 business days, depending on your card issuer's policies.</p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">5. Return Shipping</h2>
          <p>You will be responsible for paying for your own shipping costs for returning your item, unless the return is due to a defect or damage upon arrival. Shipping costs are non-refundable.</p>
        </div>
      </div>
    </div>
  )
}
