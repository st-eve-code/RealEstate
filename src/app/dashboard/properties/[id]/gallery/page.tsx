'use client'

import { useState, useEffect, use, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { ChevronLeft, X, ChevronRight, ChevronLeft as ChevronLeftIcon, Download } from 'lucide-react'
import Loader from '@/components/ado/loader'

function GalleryContent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id: propertyId } = use(params)
  const [images, setImages] = useState<string[]>([])
  const [propertyName, setPropertyName] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyDoc = await getDoc(doc(db, 'units', propertyId))
        if (propertyDoc.exists()) {
          const data = propertyDoc.data()
          const allImages = data.images ? data.images.flatMap((img: any) => img.urls || []) : []
          setImages(allImages)
          setPropertyName(data.name || 'Property Gallery')
        }
      } catch (error) {
        console.error('Error fetching property:', error)
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (selectedImage !== null && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1)
    }
  }

  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `property-image-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader style="dot-121" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to Property</span>
          </button>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{propertyName}</h1>
          <p className="text-gray-600">{images.length} photos</p>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No images available for this property.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                onClick={() => openLightbox(index)}
                className="relative h-64 rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={image}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg font-semibold">
                    View Full Size
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all duration-300 z-10"
          >
            <X className="w-8 h-8 text-white" />
          </button>

          {/* Download Button */}
          <button
            onClick={() => downloadImage(images[selectedImage])}
            className="absolute top-4 right-20 p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all duration-300 z-10"
          >
            <Download className="w-8 h-8 text-white" />
          </button>

          {/* Previous Button */}
          {selectedImage > 0 && (
            <button
              onClick={prevImage}
              className="absolute left-4 p-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all duration-300"
            >
              <ChevronLeftIcon className="w-8 h-8 text-white" />
            </button>
          )}

          {/* Image */}
          <div className="max-w-7xl max-h-[90vh] relative">
            <img
              src={images[selectedImage]}
              alt={`Property image ${selectedImage + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
              {selectedImage + 1} / {images.length}
            </div>
          </div>

          {/* Next Button */}
          {selectedImage < images.length - 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 p-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all duration-300"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function GalleryPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className='absolute top-0 left-0 w-screen h-screen'>
        <Loader style='dot-121' />
      </div>
    }>
      <GalleryContent params={params} />
    </Suspense>
  )
}
