export const metadata = {
  title: 'Frequently Asked Questions | AR FURNITURE',
  description: 'Find answers to common questions about AR Furniture, delivery, customization, and warranty.',
}

export default function FAQPage() {
  const faqs = [
    {
      question: "Do you offer free delivery in Vadodara?",
      answer: "We offer delivery across Vadodara. Delivery charges may apply based on the size of the furniture and exact location, which are typically paid directly at the time of delivery."
    },
    {
      question: "Can I customize the color and fabric of my sofa?",
      answer: "Absolutely! We specialize in custom-made furniture. You can choose from a wide variety of premium fabrics, leathers, and colors to match your home interior. Get in touch with us on WhatsApp to discuss customization."
    },
    {
      question: "How long does it take to deliver a custom order?",
      answer: "Custom furniture orders typically take between 3 to 6 weeks to manufacture and deliver, depending on the complexity of the design and availability of specific materials."
    },
    {
      question: "Do you provide a warranty on your furniture?",
      answer: "Yes, we provide a standard 1-year warranty on manufacturing defects for all our furniture. This covers structural issues but does not cover normal wear and tear or accidental damage."
    },
    {
      question: "Where is your showroom located?",
      answer: "Our premium showroom is located at 1-2 Shashtri Nagar, Nr. Purnima Nagar, New VIP Road, Vadodara, Gujarat. We welcome you to visit us and experience our furniture quality firsthand."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major Credit/Debit cards, UPI (Google Pay, PhonePe, Paytm), and Net Banking securely through our Razorpay checkout."
    }
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <div className="bg-zinc-50 py-16 md:py-24">
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-zinc-600">Got a question? We've got answers. If you have some other questions, feel free to contact us.</p>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 md:p-8">
              <h3 className="text-xl font-bold text-zinc-900 mb-3">{faq.question}</h3>
              <p className="text-zinc-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-zinc-900 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-zinc-400 mb-6">Can't find the answer you're looking for? Please chat with our friendly design experts.</p>
          <a href="https://wa.me/918511939151" target="_blank" rel="noopener noreferrer" className="inline-block bg-amber-500 hover:bg-amber-600 text-zinc-900 font-bold py-3 px-8 rounded-md transition-colors">
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
