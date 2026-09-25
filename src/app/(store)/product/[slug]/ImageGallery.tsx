'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ImageGallery({ images, productName }: { images: string[], productName: string }) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '')

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 border border-zinc-200">
        No Image Available
      </div>
    )
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[500px] pb-2 lg:pb-0 hide-scrollbar lg:w-24 flex-shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative aspect-square w-20 lg:w-full rounded-md overflow-hidden bg-zinc-100 flex-shrink-0 transition-all ${
                selectedImage === img ? 'ring-2 ring-amber-600 opacity-100' : 'ring-1 ring-zinc-200 opacity-70 hover:opacity-100'
              }`}
            >
              <Image 
                src={img} 
                alt={`${productName} thumbnail ${idx + 1}`} 
                fill
                sizes="96px"
                className="object-cover" 
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="aspect-square w-full bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200 relative">
        <Image 
          src={selectedImage} 
          alt={productName} 
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
