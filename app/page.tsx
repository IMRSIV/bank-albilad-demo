'use client'

import { useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import FilterPanel from '@/components/FilterPanel'
import PropertyCard from '@/components/PropertyCard'
import ApiStatus from '@/components/ApiStatus'
import { searchProperties, PropertySearchParams, Property } from '@/services/sakaniApi'

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState<PropertySearchParams>({
    query: '',
    propertyType: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    purpose: 'sale', // sale or rent
  })

  const handleSearch = async (params: PropertySearchParams) => {
    setLoading(true)
    setSearchParams(params)
    try {
      const results = await searchProperties(params)
      setProperties(results)
    } catch (error) {
      console.error('Search error:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial load with default search
    handleSearch(searchParams)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <ApiStatus />
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-bank-primary mb-2">
          البحث عن عقار
        </h1>
        <p className="text-gray-600">
          ابحث عن العقارات المناسبة لك من خلال منصة سكني
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FilterPanel
            searchParams={searchParams}
            onSearch={handleSearch}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <SearchBar
            onSearch={(query) => handleSearch({ ...searchParams, query })}
            initialQuery={searchParams.query}
          />

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bank-primary"></div>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">لا توجد نتائج</p>
              <p className="text-gray-400 mt-2">جرب تغيير معايير البحث</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-gray-600">
                تم العثور على {properties.length} عقار
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

