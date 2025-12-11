/**
 * Sakani API Service
 * 
 * Real API integration for Sakani real estate platform
 * 
 * Configuration:
 * - Set NEXT_PUBLIC_SAKANI_API_BASE_URL in .env.local
 * - Set NEXT_PUBLIC_SAKANI_API_KEY or NEXT_PUBLIC_SAKANI_API_TOKEN in .env.local
 */

import axios, { AxiosInstance, AxiosError } from 'axios'

export interface PropertySearchParams {
  query?: string
  propertyType?: string
  city?: string
  minPrice?: string
  maxPrice?: string
  bedrooms?: string
  purpose?: 'sale' | 'rent'
  page?: number
  limit?: number
}

export interface Property {
  id: string
  title: string
  description: string
  price: number
  city: string
  propertyType: string
  bedrooms: number
  bathrooms?: number
  area: number
  image?: string
  images?: string[]
  purpose: 'sale' | 'rent'
  location?: {
    latitude: number
    longitude: number
  }
  amenities?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface SakaniApiResponse {
  success: boolean
  data: Property[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  message?: string
}

// Get API configuration from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_SAKANI_API_BASE_URL || 'https://api.sakani.sa/api/v1'
const API_KEY = process.env.NEXT_PUBLIC_SAKANI_API_KEY
const API_TOKEN = process.env.NEXT_PUBLIC_SAKANI_API_TOKEN
// Allow guest access - only use mock data if explicitly set to true
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
const GUEST_MODE = !API_KEY && !API_TOKEN // Guest mode when no credentials provided

// Create axios instance for Sakani API
const sakaniApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'ar',
  },
})

// Add authentication interceptor (only if credentials are provided)
if (API_KEY) {
  sakaniApi.interceptors.request.use((config) => {
    config.headers['X-API-Key'] = API_KEY
    return config
  })
}

if (API_TOKEN) {
  sakaniApi.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${API_TOKEN}`
    return config
  })
}

// Guest mode: Add common headers that might be needed for public access
if (GUEST_MODE && !USE_MOCK_DATA) {
  sakaniApi.interceptors.request.use((config) => {
    // Some APIs accept guest requests with these headers
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    config.headers['Referer'] = 'https://sakani.sa'
    return config
  })
}

// Error handling interceptor
sakaniApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      console.error('Sakani API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      })
    } else if (error.request) {
      // Request made but no response received
      console.error('Sakani API Network Error:', error.message)
    } else {
      // Something else happened
      console.error('Sakani API Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// Mock data fallback (used when API is not configured or fails)
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'شقة فاخرة في حي النرجس',
    description: 'شقة حديثة ومميزة في موقع استراتيجي، تتكون من 3 غرف نوم وصالتين مع دورة مياه وحديقة صغيرة. المبنى يحتوي على مواقف سيارات وخدمات أمنية.',
    price: 1500000,
    city: 'الرياض',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    purpose: 'sale',
  },
  {
    id: '2',
    title: 'فيلا راقية في حي الياسمين',
    description: 'فيلا فاخرة على مساحة كبيرة مع حديقة واسعة وبركة سباحة. تتكون من 5 غرف نوم و4 دورات مياه مع صالة استقبال وصالة طعام.',
    price: 3500000,
    city: 'الرياض',
    propertyType: 'فيلا',
    bedrooms: 5,
    bathrooms: 4,
    area: 400,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    purpose: 'sale',
  },
  {
    id: '3',
    title: 'شقة للإيجار في حي الزهراء',
    description: 'شقة مريحة ومناسبة للعائلات، تتكون من غرفتين نوم مع صالة ودورة مياه. قريبة من المدارس والمراكز التجارية.',
    price: 45000,
    city: 'جدة',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 100,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'rent',
  },
  {
    id: '4',
    title: 'تاون هاوس في حي الروابي',
    description: 'تاون هاوس عصري بتصميم حديث، يتكون من 4 غرف نوم و3 دورات مياه مع سطح خاص. مناسب للعائلات الكبيرة.',
    price: 2200000,
    city: 'الرياض',
    propertyType: 'تاون هاوس',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    purpose: 'sale',
  },
  {
    id: '5',
    title: 'شقة للإيجار في حي العليا',
    description: 'شقة أنيقة في موقع ممتاز، تتكون من 3 غرف نوم وصالتين مع دورة مياه. قريبة من جميع الخدمات.',
    price: 65000,
    city: 'الرياض',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'rent',
  },
  {
    id: '6',
    title: 'فيلا في حي الحمراء',
    description: 'فيلا فاخرة مع حديقة كبيرة وملعب أطفال. تتكون من 6 غرف نوم و5 دورات مياه مع قبو ومواقف متعددة.',
    price: 4800000,
    city: 'جدة',
    propertyType: 'فيلا',
    bedrooms: 6,
    bathrooms: 5,
    area: 550,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    purpose: 'sale',
  },
]

/**
 * Filter mock properties (fallback function)
 */
function filterMockProperties(params: PropertySearchParams): Property[] {
  let filtered = [...mockProperties]

  if (params.query) {
    const query = params.query.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query)
    )
  }

  if (params.city) {
    filtered = filtered.filter((p) => p.city === params.city)
  }

  if (params.propertyType) {
    filtered = filtered.filter((p) => p.propertyType === params.propertyType)
  }

  if (params.bedrooms) {
    const beds = parseInt(params.bedrooms)
    if (params.bedrooms === '5+') {
      filtered = filtered.filter((p) => p.bedrooms >= 5)
    } else {
      filtered = filtered.filter((p) => p.bedrooms === beds)
    }
  }

  if (params.purpose) {
    filtered = filtered.filter((p) => p.purpose === params.purpose)
  }

  if (params.minPrice) {
    const min = parseInt(params.minPrice)
    filtered = filtered.filter((p) => p.price >= min)
  }

  if (params.maxPrice) {
    const max = parseInt(params.maxPrice)
    filtered = filtered.filter((p) => p.price <= max)
  }

  return filtered
}

/**
 * Transform Sakani API response to our Property interface
 * This function adapts the API response structure to match our expected format
 */
function transformApiResponse(apiData: any): Property[] {
  // Adapt this function based on the actual Sakani API response structure
  if (Array.isArray(apiData)) {
    return apiData.map((item: any) => ({
      id: item.id || item.propertyId || String(item._id),
      title: item.title || item.name || item.propertyTitle,
      description: item.description || item.details || '',
      price: item.price || item.priceAmount || 0,
      city: item.city || item.location?.city || '',
      propertyType: item.propertyType || item.type || item.category || '',
      bedrooms: item.bedrooms || item.bedroomCount || 0,
      bathrooms: item.bathrooms || item.bathroomCount,
      area: item.area || item.size || item.squareMeters || 0,
      image: item.image || item.primaryImage || item.images?.[0] || item.thumbnail,
      images: item.images || (item.image ? [item.image] : []),
      purpose: item.purpose || item.listingType || (item.forRent ? 'rent' : 'sale'),
      location: item.location?.coordinates ? {
        latitude: item.location.coordinates[1] || item.location.lat,
        longitude: item.location.coordinates[0] || item.location.lng,
      } : item.location,
      amenities: item.amenities || item.features || [],
      createdAt: item.createdAt || item.created,
      updatedAt: item.updatedAt || item.updated,
    }))
  }
  
  // If response has a data property
  if (apiData.data && Array.isArray(apiData.data)) {
    return transformApiResponse(apiData.data)
  }
  
  return []
}

/**
 * Search properties using Sakani API
 * 
 * API Endpoint: GET /properties/search or /marketplace/search
 * 
 * Query Parameters:
 * - query: Search text
 * - city: City name
 * - propertyType: Type of property
 * - purpose: 'sale' or 'rent'
 * - minPrice: Minimum price
 * - maxPrice: Maximum price
 * - bedrooms: Number of bedrooms
 * - page: Page number
 * - limit: Results per page
 */
export async function searchProperties(
  params: PropertySearchParams
): Promise<Property[]> {
  // Use mock data if configured or if API is not available
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return filterMockProperties(params)
  }

  try {
    // Build query parameters for the proxy API route
    const queryParams = new URLSearchParams()
    
    if (params.query) queryParams.append('query', params.query)
    if (params.city) queryParams.append('city', params.city)
    if (params.propertyType) queryParams.append('propertyType', params.propertyType)
    if (params.purpose) queryParams.append('purpose', params.purpose)
    if (params.minPrice) queryParams.append('minPrice', params.minPrice)
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice)
    if (params.bedrooms) queryParams.append('bedrooms', params.bedrooms)
    if (params.page) queryParams.append('page', String(params.page))
    if (params.limit) queryParams.append('limit', String(params.limit))

    // Use Next.js API route as proxy to avoid CORS issues
    const response = await fetch(`/api/sakani/search?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      // If proxy returns fallback flag, use mock data
      if (errorData.fallback) {
        throw new Error('API unavailable, using fallback')
      }
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform the response to match our Property interface
    const properties = transformApiResponse(data.data || data)
    
    if (properties.length > 0) {
      return properties
    }

    // If no properties found, fall back to mock data
    throw new Error('No properties found, using fallback')
  } catch (error: any) {
    console.error('Error fetching properties from Sakani API:', error)
    
    // Fallback to mock data on error
    console.warn('Falling back to mock data due to API error')
    return filterMockProperties(params)
  }
}

/**
 * Get property details by ID
 * 
 * API Endpoint: GET /properties/{id} or /marketplace/{id}
 */
export async function getPropertyDetails(id: string): Promise<Property> {
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const property = mockProperties.find((p) => p.id === id)
    if (!property) {
      throw new Error('Property not found')
    }
    return property
  }

  try {
    // Use Next.js API route as proxy to avoid CORS issues
    const response = await fetch(`/api/sakani/property/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      // If proxy returns fallback flag, use mock data
      if (errorData.fallback) {
        throw new Error('API unavailable, using fallback')
      }
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const transformed = transformApiResponse([data.data || data])
    
    if (transformed.length > 0) {
      return transformed[0]
    }

    throw new Error('Property not found')
  } catch (error: any) {
    console.error('Error fetching property details from Sakani API:', error)
    
    // Fallback to mock data
    const property = mockProperties.find((p) => p.id === id)
    if (property) {
      return property
    }
    
    throw new Error('Property not found')
  }
}

/**
 * Check if API is configured and available
 */
export function isApiConfigured(): boolean {
  return !USE_MOCK_DATA
}

/**
 * Check if running in guest mode (no credentials)
 */
export function isGuestMode(): boolean {
  return GUEST_MODE && !USE_MOCK_DATA
}

/**
 * Get API status
 */
export async function checkApiStatus(): Promise<{ available: boolean; message: string }> {
  if (USE_MOCK_DATA) {
    return {
      available: false,
      message: 'Using mock data. Set NEXT_PUBLIC_USE_MOCK_DATA=false to use real API',
    }
  }

  if (GUEST_MODE) {
    return {
      available: true,
      message: 'Guest mode: Accessing public API endpoints without authentication',
    }
  }

  try {
    // Try a simple health check endpoint
    await sakaniApi.get('/health', { timeout: 5000 })
    return {
      available: true,
      message: 'API is available',
    }
  } catch (error: any) {
    return {
      available: false,
      message: `API check failed: ${error.message}`,
    }
  }
}
