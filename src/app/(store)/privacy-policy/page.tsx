export const metadata = {
  title: 'Privacy Policy | AR FURNITURE',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-zinc max-w-none text-zinc-700 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information from you when you register on our site, place an order, subscribe to our newsletter, or fill out a form. The collected information may include your name, email address, mailing address, phone number, and payment information.</p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p>The information we collect from you may be used in the following ways:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>To process and fulfill your furniture orders</li>
            <li>To improve our website and customer service</li>
            <li>To send periodic emails regarding your order or other products and services</li>
            <li>To process payments securely via Razorpay</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">3. Data Protection</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We do not store sensitive payment details like credit card numbers on our servers; these are handled securely by our payment gateway partner, Razorpay.</p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">4. Third-Party Disclosure</h2>
          <p>We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">5. Contact Us</h2>
          <p>If there are any questions regarding this privacy policy, you may contact us using the information below:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Email: furniturear31@gmail.com</li>
            <li>Phone: 8511939151</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
