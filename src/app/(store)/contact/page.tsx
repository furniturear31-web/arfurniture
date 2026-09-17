import { MapPin, Phone, MessageCircle } from 'lucide-react'

export const metadata = {
  title: 'Contact Us | AR FURNITURE',
  description: 'Get in touch with AR FURNITURE. Visit our showroom in Vadodara or contact us via phone or WhatsApp.',
}

export default function ContactPage() {
  return (
    <div className="bg-zinc-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Contact Us</h2>
          <p className="mt-2 text-lg leading-8 text-zinc-600">
            We would love to hear from you. Visit our showroom or drop us a message.
          </p>
        </div>
        
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2">
          
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-zinc-100 flex flex-col justify-center">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 mb-8">Get in Touch</h3>
            
            <dl className="space-y-8 text-base leading-7 text-zinc-600">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Address</span>
                  <MapPin className="h-7 w-6 text-amber-600" aria-hidden="true" />
                </dt>
                <dd>
                  <p className="font-semibold text-zinc-900">AR FURNITURE</p>
                  <p>1-2 Shashtri Nagar, Nr. Purnima Nagar,</p>
                  <p>New VIP Road, Vadodara, Gujarat</p>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Telephone</span>
                  <Phone className="h-7 w-6 text-amber-600" aria-hidden="true" />
                </dt>
                <dd>
                  <a className="hover:text-amber-600 transition-colors block" href="tel:+918511939151">
                    +91 85119 39151
                  </a>
                  <a className="hover:text-amber-600 transition-colors block mt-1" href="tel:+919898375739">
                    +91 98983 75739
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">WhatsApp</span>
                  <MessageCircle className="h-7 w-6 text-amber-600" aria-hidden="true" />
                </dt>
                <dd>
                  <a 
                    className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors" 
                    href="https://wa.me/918511939151"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Chat with us on WhatsApp &rarr;
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden h-[500px]">
             <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14766.155700813733!2d73.2081283!3d22.3168285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc8aa3bc84569%3A0xc68297b5e40702c2!2sVadodara%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  )
}
