"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ImageLightboxProps {
  images: Array<{ title: string; image: string }>
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

export function ImageLightbox({ images, initialIndex, isOpen, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [displayIndex, setDisplayIndex] = useState(initialIndex)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setDisplayIndex(initialIndex)
      setDirection(null)
      setIsAnimating(false)
    }
  }, [initialIndex, isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, images.length, onClose])

  const goToPrevious = () => {
    if (isAnimating) return
    const newIndex = displayIndex > 0 ? displayIndex - 1 : images.length - 1
    setDirection("right")
    setIsAnimating(true)
    setCurrentIndex(newIndex)
    // Update display index after animation completes
    setTimeout(() => {
      setIsAnimating(false)
      setDisplayIndex(newIndex)
      // Clear direction after a brief delay to prevent re-animation
      setTimeout(() => {
        setDirection(null)
      }, 50)
    }, 300)
  }

  const goToNext = () => {
    if (isAnimating) return
    const newIndex = displayIndex < images.length - 1 ? displayIndex + 1 : 0
    setDirection("left")
    setIsAnimating(true)
    setCurrentIndex(newIndex)
    // Update display index after animation completes
    setTimeout(() => {
      setIsAnimating(false)
      setDisplayIndex(newIndex)
      // Clear direction after a brief delay to prevent re-animation
      setTimeout(() => {
        setDirection(null)
      }, 50)
    }, 300)
  }

  if (!isOpen || !images[displayIndex]) return null

  const currentImage = images[displayIndex]
  const nextImage = isAnimating && images[currentIndex] ? images[currentIndex] : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 md:p-8 flex items-center justify-center">
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-10 text-white hover:bg-white/20 rounded-full hidden md:flex transition-all duration-200 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              aria-label="Previous image"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-10 text-white hover:bg-white/20 rounded-full hidden md:flex transition-all duration-200 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              aria-label="Next image"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </>
        )}

        <div className="relative w-full h-full max-w-5xl flex items-center justify-center overflow-hidden">
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={onClose}
          >
            <div className="relative w-full h-full">
              {/* Current/Display Image - slides out */}
              {!isAnimating && (
                <div className="absolute inset-0 translate-x-0">
                  <Image
                    key={`display-${displayIndex}`}
                    src={currentImage.image}
                    alt={currentImage.title}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  />
                </div>
              )}
              {/* Current Image sliding out */}
              {isAnimating && (
                <div
                  className={`absolute inset-0 transition-transform duration-300 ease-out ${
                    direction === "left"
                      ? "-translate-x-full"
                      : "translate-x-full"
                  }`}
                >
                  <Image
                    key={`out-${displayIndex}`}
                    src={currentImage.image}
                    alt={currentImage.title}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  />
                </div>
              )}
              {/* Next Image - slides in from opposite side */}
              {nextImage && isAnimating && (
                <div
                  className="absolute inset-0"
                  style={{ 
                    animation: direction === "left" 
                      ? 'slideInFromRight 0.3s ease-out forwards' 
                      : 'slideInFromLeft 0.3s ease-out forwards' 
                  }}
                >
                  <Image
                    key={`next-${currentIndex}`}
                    src={nextImage.image}
                    alt={nextImage.title}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm pointer-events-none z-10">
                {displayIndex + 1} of {images.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

