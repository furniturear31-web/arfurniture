export const metadata = {
  title: 'Shipping & Delivery Policy | AR FURNITURE',
}

export default function ShippingPolicyPage() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-8">Shipping & Delivery Policy</h1>
        
        <div className="prose prose-zinc max-w-none text-zinc-700 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">1. Delivery Areas</h2>
          <p>AR FURNITURE currently delivers to select pin codes across Gujarat and major metropolitan areas in India. Delivery availability is verified at checkout based on your shipping address.</p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">2. Processing & Delivery Timelines</h2>
          <p><strong>Standard Items:</strong> In-stock items are typically processed and dispatched within 3-5 business days. Delivery generally takes 7-14 business days depending on your location.</p>
          <p><strong>Custom Items:</strong> Custom-made furniture requires manufacturing time. The estimated delivery timeline will be communicated to you at the time of order confirmation, typically ranging from 3 to 6 weeks.</p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">3. Shipping Charges</h2>
          <p>Shipping charges are calculated based on the weight, dimensions of the furniture, and the delivery destination. The final shipping cost will be displayed at checkout before you complete your payment.</p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">4. Delivery Process</h2>
          <p>Our delivery partners will contact you prior to delivery to schedule a convenient time. Please ensure someone is available at the delivery address to receive and inspect the items.</p>
          <p>Standard delivery includes bringing the furniture to your doorstep. Installation or assembly services, if required, will be arranged separately or provided at the time of delivery depending on the product.</p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">5. Inspection Upon Delivery</h2>
          <p>We highly recommend inspecting the packaging and the furniture upon delivery. If you notice any external damage to the packaging, please note it on the delivery receipt before signing. If the furniture is damaged, contact us immediately within 24 hours.</p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">6. Delays</h2>
          <p>While we strive to deliver your furniture within the estimated timeframes, unforeseen circumstances (such as extreme weather, natural disasters, or transportation strikes) may cause delays. We will keep you informed of any significant delays in your order.</p>
        </div>
      </div>
    </div>
  )
}
