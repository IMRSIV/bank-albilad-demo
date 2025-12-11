'use client'

import Link from 'next/link'
import { Property } from '@/services/sakaniApi'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/property/${property.id}`}>
      <div className="card cursor-pointer h-full">
        {property.image ? (
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">لا توجد صورة</span>
          </div>
        )}
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-bank-primary mb-2 line-clamp-1">
            {property.title}
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-bold text-bank-red">
              {property.price.toLocaleString()} ريال
            </span>
            {property.purpose === 'rent' && (
              <span className="text-sm text-gray-500">/ شهرياً</span>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span>{property.city}</span>
            <span>•</span>
            <span>{property.propertyType}</span>
            <span>•</span>
            <span>{property.bedrooms} غرف</span>
          </div>
          
          <div className="text-sm text-gray-500">
            {property.area} م²
          </div>
        </div>
      </div>
    </Link>
  )
}

