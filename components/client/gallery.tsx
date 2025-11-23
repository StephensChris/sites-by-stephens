"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageLightbox } from "./image-lightbox"

interface GalleryData {
  title: string
  subtitle: string
  items: Array<{
    title: string
    image: string
  }>
}

interface GalleryProps {
  data: GalleryData
}

export function ClientGallery({ data }: GalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <section id="gallery" className="py-16 md:py-20 lg:py-24 bg-background min-h-[60vh] flex flex-col justify-center">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4 text-balance px-4 opacity-0 animate-[fadeInUp_0.7s_ease-out_0.1s_forwards]">
            {data.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-center leading-relaxed mb-12 md:mb-16 max-w-2xl mx-auto px-4 opacity-0 animate-[fadeInUp_0.7s_ease-out_0.3s_forwards]">
            {data.subtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {data.items.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl aspect-square bg-card hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02] opacity-0"
                style={{ animation: `fadeInUp 0.7s ease-out ${index * 0.05 + 0.3}s forwards` }}
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <h3 className="font-serif text-white text-xl sm:text-2xl font-semibold p-4 sm:p-6">
                    {item.title}
                  </h3>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <svg
                      className="w-5 h-5 text-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ImageLightbox
        images={data.items}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}

