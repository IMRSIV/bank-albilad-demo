'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getPropertyDetails, Property } from '@/services/sakaniApi'
import Image from 'next/image'

export default function PropertyDetails() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperty = async () => {
      if (params.id) {
        try {
          const data = await getPropertyDetails(params.id as string)
          setProperty(data)
        } catch (error) {
          console.error('Error fetching property:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchProperty()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bank-primary"></div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">العقار غير موجود</p>
          <button
            onClick={() => router.back()}
            className="btn-primary mt-4"
          >
            العودة للبحث
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 text-bank-primary hover:underline flex items-center gap-2"
      >
        ← العودة للبحث
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Image */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            {property.image ? (
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">لا توجد صورة</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h1 className="text-3xl font-bold text-bank-primary mb-4">
              {property.title}
            </h1>
            
            <div className="mb-6">
              <div className="text-3xl font-bold text-bank-red mb-2">
                {property.price.toLocaleString()} ريال
              </div>
              {property.purpose === 'rent' && (
                <span className="text-gray-500">/ شهرياً</span>
              )}
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">المدينة:</span>
                <span className="font-semibold">{property.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">نوع العقار:</span>
                <span className="font-semibold">{property.propertyType}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">عدد الغرف:</span>
                <span className="font-semibold">{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">المساحة:</span>
                <span className="font-semibold">{property.area} م²</span>
              </div>
            </div>

            <button className="btn-accent w-full">
              تواصل معنا
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-bank-primary mb-4">
              الوصف
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

