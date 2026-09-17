export const metadata = {
  title: 'Terms & Conditions | AR FURNITURE',
}

export default function TermsPage() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-zinc max-w-none text-zinc-700 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">1. Introduction</h2>
          <p>Welcome to AR FURNITURE. By accessing our website and purchasing our products, you agree to be bound by these Terms and Conditions. Please read them carefully.</p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">2. Products and Pricing</h2>
          <p>All products listed on the website are subject to availability. We reserve the right to modify or discontinue any product without notice. Prices for our products are subject to change without notice.</p>
          <p>While we make every effort to display the colors and dimensions of our furniture accurately, we cannot guarantee that your device's display will reflect the true color or exact scale of the products.</p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">3. Custom Orders</h2>
          <p>Custom orders require a 50% advance payment before production begins. Once production has started, custom orders cannot be cancelled or modified.</p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">4. Payment Terms</h2>
          <p>We accept payments via Razorpay (Credit/Debit cards, UPI, Net Banking). Full payment is required before standard delivery.</p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">5. Intellectual Property</h2>
          <p>All content on this website, including images, text, graphics, and logos, is the property of AR FURNITURE and is protected by copyright laws.</p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">6. Contact Information</h2>
          <p>Questions about the Terms and Conditions should be sent to us at:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Email: furniturear31@gmail.com</li>
            <li>Phone: 8511939151</li>
            <li>Address: 1-2 Shashtri Nagar, Nr. Purnima Nagar, New VIP Road, Vadodara, Gujarat</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
