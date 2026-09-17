import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'About Us | AR FURNITURE',
  description: 'Learn more about AR FURNITURE, Vadodara\'s premium destination for modern and custom furniture.',
}

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-zinc-950 py-24 sm:py-32 min-h-[400px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about_hero.webp"
            alt="AR Furniture Showroom"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10 w-full">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">About <span className="text-amber-500">AR Furniture</span></h1>
            <p className="mt-6 text-lg leading-8 text-zinc-300">
              Your trusted partner for premium, modern, and customized furniture in Vadodara, Gujarat.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          
          <div className="lg:pr-4 relative">
             <div className="relative overflow-hidden rounded-3xl bg-zinc-100 px-6 pb-9 pt-64 shadow-2xl sm:px-12 lg:max-w-lg lg:px-8 lg:pb-8 xl:px-10 xl:pb-10 aspect-[4/5]">
                <Image
                  src="/logo.webp"
                  alt="AR Furniture Logo"
                  fill
                  className="object-cover"
                />
             </div>
          </div>

          <div>
            <div className="text-base leading-7 text-zinc-700 lg:max-w-lg space-y-6">
              <p className="text-xl font-semibold leading-8 text-zinc-900">
                Crafting Spaces, Elevating Lifestyles
              </p>
              <p>
                At AR FURNITURE, we believe that furniture is more than just functional objects; it is an expression of your personality and the soul of your living space. Located in the heart of Vadodara, we have established ourselves as a premier destination for luxury, modern, and bespoke furniture solutions.
              </p>
              <p>
                Whether you are furnishing a cozy apartment, a sprawling villa, or a professional workspace, our extensive collection is designed to meet your diverse needs without compromising on quality or aesthetics.
              </p>
              
              <ul className="mt-8 space-y-4 text-zinc-600">
                {[
                  'Premium quality materials sourced directly',
                  'Expert craftsmanship and attention to detail',
                  'Customized designs to fit your exact dimensions',
                  'Dedicated after-sales support and delivery',
                  'Modern and timeless aesthetics'
                ].map((item) => (
                  <li key={item} className="flex gap-x-3 items-center">
                    <CheckCircle2 className="h-5 w-5 flex-none text-amber-600" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-10 flex">
              <Link
                href="/contact"
                className="rounded-md bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
              >
                Visit Our Showroom <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
