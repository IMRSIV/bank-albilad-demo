'use client'

import { useState } from 'react'
import { PropertySearchParams } from '@/services/sakaniApi'

interface FilterPanelProps {
  searchParams: PropertySearchParams
  onSearch: (params: PropertySearchParams) => void
}

const cities = ['الرياض', 'جدة', 'الدمام', 'المدينة المنورة', 'مكة المكرمة', 'الخبر']
const propertyTypes = ['شقة', 'فيلا', 'تاون هاوس', 'أرض', 'شاليه']
const bedrooms = ['1', '2', '3', '4', '5+']

export default function FilterPanel({ searchParams, onSearch }: FilterPanelProps) {
  const [filters, setFilters] = useState<PropertySearchParams>(searchParams)

  const handleFilterChange = (key: keyof PropertySearchParams, value: string) => {
    const newFilters: PropertySearchParams = { 
      ...filters, 
      [key]: key === 'purpose' ? (value as 'sale' | 'rent') : value 
    }
    setFilters(newFilters)
    onSearch(newFilters)
  }

  const clearFilters = () => {
    const cleared: PropertySearchParams = {
      query: '',
      propertyType: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      purpose: 'sale',
    }
    setFilters(cleared)
    onSearch(cleared)
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-bank-primary">الفلاتر</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-bank-red hover:underline"
        >
          مسح الكل
        </button>
      </div>

      <div className="space-y-6">
        {/* Purpose */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            نوع العملية
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleFilterChange('purpose', 'sale')}
              className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                filters.purpose === 'sale'
                  ? 'bg-bank-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              للبيع
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('purpose', 'rent')}
              className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                filters.purpose === 'rent'
                  ? 'bg-bank-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              للإيجار
            </button>
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            المدينة
          </label>
          <select
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="input-field"
          >
            <option value="">جميع المدن</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            نوع العقار
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            className="input-field"
          >
            <option value="">جميع الأنواع</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            عدد الغرف
          </label>
          <select
            value={filters.bedrooms}
            onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
            className="input-field"
          >
            <option value="">أي عدد</option>
            {bedrooms.map((bed) => (
              <option key={bed} value={bed}>
                {bed} غرفة
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            نطاق السعر
          </label>
          <div className="space-y-2">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="الحد الأدنى"
              className="input-field"
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="الحد الأقصى"
              className="input-field"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

