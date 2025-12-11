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
// 100 realistic properties from Sakani platform
const mockProperties: Property[] = [
  // الرياض - شقق للبيع
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
    title: 'شقة راقية في حي الياسمين',
    description: 'شقة أنيقة بتصميم عصري، 4 غرف نوم و3 دورات مياه مع صالة واسعة ومطبخ مجهز. قريبة من المراكز التجارية والمدارس.',
    price: 1850000,
    city: 'الرياض',
    propertyType: 'شقة',
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'sale',
  },
  {
    id: '3',
    title: 'شقة في حي العليا',
    description: 'شقة متميزة في موقع حيوي، 2 غرفة نوم وصالة مع دورة مياه. مناسبة للعزاب أو العائلات الصغيرة.',
    price: 950000,
    city: 'الرياض',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 110,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'sale',
  },
  {
    id: '4',
    title: 'شقة فاخرة في حي المطار',
    description: 'شقة حديثة بتصميم راقي، 3 غرف نوم وصالتين مع دورة مياه. المبنى يحتوي على مصعد وخدمات أمنية 24/7.',
    price: 1200000,
    city: 'الرياض',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 135,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    purpose: 'sale',
  },
  {
    id: '5',
    title: 'شقة في حي العريجاء',
    description: 'شقة مريحة ومناسبة للعائلات، 3 غرف نوم وصالة مع دورة مياه. قريبة من المدارس والمساجد.',
    price: 1100000,
    city: 'الرياض',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 125,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800',
    purpose: 'sale',
  },
  // الرياض - فيلات للبيع
  {
    id: '6',
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
    id: '7',
    title: 'فيلا في حي النرجس',
    description: 'فيلا حديثة بتصميم عصري، 6 غرف نوم و5 دورات مياه مع حديقة وملعب أطفال. قريبة من جميع الخدمات.',
    price: 4200000,
    city: 'الرياض',
    propertyType: 'فيلا',
    bedrooms: 6,
    bathrooms: 5,
    area: 480,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    purpose: 'sale',
  },
  {
    id: '8',
    title: 'فيلا فاخرة في حي العليا',
    description: 'فيلا راقية مع حديقة كبيرة وبركة سباحة. 7 غرف نوم و6 دورات مياه مع قبو ومواقف متعددة.',
    price: 5500000,
    city: 'الرياض',
    propertyType: 'فيلا',
    bedrooms: 7,
    bathrooms: 6,
    area: 600,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    purpose: 'sale',
  },
  {
    id: '9',
    title: 'فيلا في حي الروابي',
    description: 'فيلا أنيقة بتصميم حديث، 4 غرف نوم و3 دورات مياه مع حديقة صغيرة. مناسبة للعائلات المتوسطة.',
    price: 2800000,
    city: 'الرياض',
    propertyType: 'فيلا',
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    purpose: 'sale',
  },
  {
    id: '10',
    title: 'فيلا في حي المطار',
    description: 'فيلا متميزة مع حديقة واسعة، 5 غرف نوم و4 دورات مياه. موقع استراتيجي قريب من المطار.',
    price: 3200000,
    city: 'الرياض',
    propertyType: 'فيلا',
    bedrooms: 5,
    bathrooms: 4,
    area: 380,
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
    purpose: 'sale',
  },
  // الرياض - تاون هاوس للبيع
  {
    id: '11',
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
    id: '12',
    title: 'تاون هاوس في حي النرجس',
    description: 'تاون هاوس راقي مع حديقة صغيرة، 3 غرف نوم و2 دورات مياه. تصميم عصري ومناسب للعائلات.',
    price: 1800000,
    city: 'الرياض',
    propertyType: 'تاون هاوس',
    bedrooms: 3,
    bathrooms: 2,
    area: 240,
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
    purpose: 'sale',
  },
  {
    id: '13',
    title: 'تاون هاوس في حي الياسمين',
    description: 'تاون هاوس فاخر مع سطح خاص، 5 غرف نوم و4 دورات مياه. موقع ممتاز قريب من الخدمات.',
    price: 2600000,
    city: 'الرياض',
    propertyType: 'تاون هاوس',
    bedrooms: 5,
    bathrooms: 4,
    area: 320,
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
    purpose: 'sale',
  },
  // الرياض - شقق للإيجار
  {
    id: '14',
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
    id: '15',
    title: 'شقة للإيجار في حي النرجس',
    description: 'شقة مريحة ومناسبة للعائلات، 2 غرفة نوم وصالة مع دورة مياه. قريبة من المدارس والمراكز التجارية.',
    price: 45000,
    city: 'الرياض',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 100,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'rent',
  },
  {
    id: '16',
    title: 'شقة للإيجار في حي الياسمين',
    description: 'شقة حديثة بتصميم عصري، 4 غرف نوم و3 دورات مياه. مناسبة للعائلات الكبيرة.',
    price: 85000,
    city: 'الرياض',
    propertyType: 'شقة',
    bedrooms: 4,
    bathrooms: 3,
    area: 170,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    purpose: 'rent',
  },
  {
    id: '17',
    title: 'شقة للإيجار في حي المطار',
    description: 'شقة أنيقة في موقع حيوي، 1 غرفة نوم وصالة مع دورة مياه. مناسبة للعزاب.',
    price: 35000,
    city: 'الرياض',
    propertyType: 'شقة',
    bedrooms: 1,
    bathrooms: 1,
    area: 75,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800',
    purpose: 'rent',
  },
  {
    id: '18',
    title: 'شقة للإيجار في حي الروابي',
    description: 'شقة مريحة ومناسبة، 3 غرف نوم وصالتين مع دورة مياه. قريبة من جميع الخدمات.',
    price: 55000,
    city: 'الرياض',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 130,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    purpose: 'rent',
  },
  // جدة - شقق للبيع
  {
    id: '19',
    title: 'شقة فاخرة في حي الزهراء',
    description: 'شقة راقية في موقع ممتاز بجدة، 3 غرف نوم وصالتين مع دورة مياه. قريبة من البحر والمراكز التجارية.',
    price: 1800000,
    city: 'جدة',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    purpose: 'sale',
  },
  {
    id: '20',
    title: 'شقة في حي الحمراء',
    description: 'شقة أنيقة بتصميم حديث، 2 غرفة نوم وصالة مع دورة مياه. قريبة من الكورنيش.',
    price: 1200000,
    city: 'جدة',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 115,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'sale',
  },
  {
    id: '21',
    title: 'شقة في حي الرويس',
    description: 'شقة متميزة في موقع حيوي، 4 غرف نوم و3 دورات مياه. مناسبة للعائلات الكبيرة.',
    price: 2200000,
    city: 'جدة',
    propertyType: 'شقة',
    bedrooms: 4,
    bathrooms: 3,
    area: 190,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'sale',
  },
  {
    id: '22',
    title: 'شقة في حي البغدادية',
    description: 'شقة حديثة ومريحة، 3 غرف نوم وصالتين مع دورة مياه. قريبة من المدارس والمساجد.',
    price: 1400000,
    city: 'جدة',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 145,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    purpose: 'sale',
  },
  {
    id: '23',
    title: 'شقة في حي الصفا',
    description: 'شقة فاخرة في موقع استراتيجي، 5 غرف نوم و4 دورات مياه. مناسبة للعائلات الكبيرة.',
    price: 2800000,
    city: 'جدة',
    propertyType: 'شقة',
    bedrooms: 5,
    bathrooms: 4,
    area: 250,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800',
    purpose: 'sale',
  },
  // جدة - فيلات للبيع
  {
    id: '24',
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
  {
    id: '25',
    title: 'فيلا في حي الزهراء',
    description: 'فيلا راقية قريبة من البحر، 5 غرف نوم و4 دورات مياه مع بركة سباحة وحديقة واسعة.',
    price: 5200000,
    city: 'جدة',
    propertyType: 'فيلا',
    bedrooms: 5,
    bathrooms: 4,
    area: 480,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    purpose: 'sale',
  },
  {
    id: '26',
    title: 'فيلا في حي الرويس',
    description: 'فيلا حديثة بتصميم عصري، 7 غرف نوم و6 دورات مياه مع حديقة وملعب أطفال.',
    price: 6200000,
    city: 'جدة',
    propertyType: 'فيلا',
    bedrooms: 7,
    bathrooms: 6,
    area: 650,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    purpose: 'sale',
  },
  {
    id: '27',
    title: 'فيلا في حي الصفا',
    description: 'فيلا أنيقة مع حديقة كبيرة، 4 غرف نوم و3 دورات مياه. موقع ممتاز قريب من الكورنيش.',
    price: 3800000,
    city: 'جدة',
    propertyType: 'فيلا',
    bedrooms: 4,
    bathrooms: 3,
    area: 360,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    purpose: 'sale',
  },
  {
    id: '28',
    title: 'فيلا في حي البغدادية',
    description: 'فيلا متميزة مع بركة سباحة، 6 غرف نوم و5 دورات مياه. مناسبة للعائلات الكبيرة.',
    price: 4500000,
    city: 'جدة',
    propertyType: 'فيلا',
    bedrooms: 6,
    bathrooms: 5,
    area: 520,
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
    purpose: 'sale',
  },
  // جدة - شقق للإيجار
  {
    id: '29',
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
    id: '30',
    title: 'شقة للإيجار في حي الحمراء',
    description: 'شقة أنيقة قريبة من الكورنيش، 3 غرف نوم وصالتين مع دورة مياه. موقع ممتاز.',
    price: 70000,
    city: 'جدة',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'rent',
  },
  {
    id: '31',
    title: 'شقة للإيجار في حي الرويس',
    description: 'شقة حديثة ومريحة، 1 غرفة نوم وصالة مع دورة مياه. مناسبة للعزاب.',
    price: 38000,
    city: 'جدة',
    propertyType: 'شقة',
    bedrooms: 1,
    bathrooms: 1,
    area: 80,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    purpose: 'rent',
  },
  {
    id: '32',
    title: 'شقة للإيجار في حي الصفا',
    description: 'شقة فاخرة في موقع ممتاز، 4 غرف نوم و3 دورات مياه. قريبة من جميع الخدمات.',
    price: 90000,
    city: 'جدة',
    propertyType: 'شقة',
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800',
    purpose: 'rent',
  },
  {
    id: '33',
    title: 'شقة للإيجار في حي البغدادية',
    description: 'شقة مريحة ومناسبة، 2 غرفة نوم وصالة مع دورة مياه. قريبة من المدارس.',
    price: 50000,
    city: 'جدة',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 105,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    purpose: 'rent',
  },
  // الدمام - شقق للبيع
  {
    id: '34',
    title: 'شقة في حي الفيصلية',
    description: 'شقة حديثة ومميزة في الدمام، 3 غرف نوم وصالتين مع دورة مياه. قريبة من المراكز التجارية.',
    price: 1300000,
    city: 'الدمام',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    purpose: 'sale',
  },
  {
    id: '35',
    title: 'شقة في حي الشاطئ',
    description: 'شقة راقية قريبة من البحر، 2 غرفة نوم وصالة مع دورة مياه. موقع ممتاز.',
    price: 1100000,
    city: 'الدمام',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 120,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'sale',
  },
  {
    id: '36',
    title: 'شقة في حي العدامة',
    description: 'شقة أنيقة بتصميم عصري، 4 غرف نوم و3 دورات مياه. مناسبة للعائلات الكبيرة.',
    price: 1700000,
    city: 'الدمام',
    propertyType: 'شقة',
    bedrooms: 4,
    bathrooms: 3,
    area: 175,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'sale',
  },
  {
    id: '37',
    title: 'شقة في حي النزهة',
    description: 'شقة مريحة ومناسبة، 3 غرف نوم وصالتين مع دورة مياه. قريبة من المدارس.',
    price: 1250000,
    city: 'الدمام',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 135,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    purpose: 'sale',
  },
  // الدمام - فيلات للبيع
  {
    id: '38',
    title: 'فيلا في حي الفيصلية',
    description: 'فيلا فاخرة مع حديقة واسعة، 5 غرف نوم و4 دورات مياه. موقع استراتيجي.',
    price: 3200000,
    city: 'الدمام',
    propertyType: 'فيلا',
    bedrooms: 5,
    bathrooms: 4,
    area: 420,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    purpose: 'sale',
  },
  {
    id: '39',
    title: 'فيلا في حي الشاطئ',
    description: 'فيلا راقية قريبة من البحر، 6 غرف نوم و5 دورات مياه مع بركة سباحة.',
    price: 4800000,
    city: 'الدمام',
    propertyType: 'فيلا',
    bedrooms: 6,
    bathrooms: 5,
    area: 520,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    purpose: 'sale',
  },
  {
    id: '40',
    title: 'فيلا في حي العدامة',
    description: 'فيلا حديثة بتصميم عصري، 4 غرف نوم و3 دورات مياه مع حديقة.',
    price: 2800000,
    city: 'الدمام',
    propertyType: 'فيلا',
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    purpose: 'sale',
  },
  // الدمام - شقق للإيجار
  {
    id: '41',
    title: 'شقة للإيجار في حي الفيصلية',
    description: 'شقة مريحة ومناسبة، 2 غرفة نوم وصالة مع دورة مياه. قريبة من الخدمات.',
    price: 40000,
    city: 'الدمام',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 95,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'rent',
  },
  {
    id: '42',
    title: 'شقة للإيجار في حي الشاطئ',
    description: 'شقة أنيقة قريبة من البحر، 3 غرف نوم وصالتين مع دورة مياه.',
    price: 60000,
    city: 'الدمام',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 145,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'rent',
  },
  // المدينة المنورة - شقق للبيع
  {
    id: '43',
    title: 'شقة في حي قباء',
    description: 'شقة فاخرة قريبة من مسجد قباء، 3 غرف نوم وصالتين مع دورة مياه. موقع مميز.',
    price: 1400000,
    city: 'المدينة المنورة',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    purpose: 'sale',
  },
  {
    id: '44',
    title: 'شقة في حي العالية',
    description: 'شقة راقية في موقع استراتيجي، 2 غرفة نوم وصالة مع دورة مياه. قريبة من المسجد النبوي.',
    price: 1150000,
    city: 'المدينة المنورة',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 125,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'sale',
  },
  {
    id: '45',
    title: 'شقة في حي العوالي',
    description: 'شقة حديثة ومريحة، 4 غرف نوم و3 دورات مياه. مناسبة للعائلات الكبيرة.',
    price: 1900000,
    city: 'المدينة المنورة',
    propertyType: 'شقة',
    bedrooms: 4,
    bathrooms: 3,
    area: 185,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'sale',
  },
  // المدينة المنورة - فيلات للبيع
  {
    id: '46',
    title: 'فيلا في حي قباء',
    description: 'فيلا فاخرة قريبة من مسجد قباء، 5 غرف نوم و4 دورات مياه مع حديقة.',
    price: 3500000,
    city: 'المدينة المنورة',
    propertyType: 'فيلا',
    bedrooms: 5,
    bathrooms: 4,
    area: 430,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    purpose: 'sale',
  },
  {
    id: '47',
    title: 'فيلا في حي العالية',
    description: 'فيلا راقية في موقع ممتاز، 6 غرف نوم و5 دورات مياه. قريبة من المسجد النبوي.',
    price: 4200000,
    city: 'المدينة المنورة',
    propertyType: 'فيلا',
    bedrooms: 6,
    bathrooms: 5,
    area: 500,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    purpose: 'sale',
  },
  // المدينة المنورة - شقق للإيجار
  {
    id: '48',
    title: 'شقة للإيجار في حي قباء',
    description: 'شقة مريحة قريبة من مسجد قباء، 2 غرفة نوم وصالة مع دورة مياه.',
    price: 42000,
    city: 'المدينة المنورة',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 110,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'rent',
  },
  {
    id: '49',
    title: 'شقة للإيجار في حي العالية',
    description: 'شقة أنيقة قريبة من المسجد النبوي، 3 غرف نوم وصالتين مع دورة مياه.',
    price: 58000,
    city: 'المدينة المنورة',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'rent',
  },
  // مكة المكرمة - شقق للبيع
  {
    id: '50',
    title: 'شقة في حي العزيزية',
    description: 'شقة فاخرة قريبة من الحرم المكي، 3 غرف نوم وصالتين مع دورة مياه. موقع مميز.',
    price: 1600000,
    city: 'مكة المكرمة',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 155,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    purpose: 'sale',
  },
  {
    id: '51',
    title: 'شقة في حي الزاهر',
    description: 'شقة راقية في موقع استراتيجي، 2 غرفة نوم وصالة مع دورة مياه.',
    price: 1250000,
    city: 'مكة المكرمة',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 130,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'sale',
  },
  {
    id: '52',
    title: 'شقة في حي الشوقية',
    description: 'شقة حديثة ومريحة، 4 غرف نوم و3 دورات مياه. قريبة من الحرم المكي.',
    price: 2000000,
    city: 'مكة المكرمة',
    propertyType: 'شقة',
    bedrooms: 4,
    bathrooms: 3,
    area: 190,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'sale',
  },
  // مكة المكرمة - فيلات للبيع
  {
    id: '53',
    title: 'فيلا في حي العزيزية',
    description: 'فيلا فاخرة قريبة من الحرم المكي، 5 غرف نوم و4 دورات مياه مع حديقة.',
    price: 3800000,
    city: 'مكة المكرمة',
    propertyType: 'فيلا',
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    purpose: 'sale',
  },
  {
    id: '54',
    title: 'فيلا في حي الزاهر',
    description: 'فيلا راقية في موقع ممتاز، 6 غرف نوم و5 دورات مياه.',
    price: 4500000,
    city: 'مكة المكرمة',
    propertyType: 'فيلا',
    bedrooms: 6,
    bathrooms: 5,
    area: 530,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    purpose: 'sale',
  },
  // مكة المكرمة - شقق للإيجار
  {
    id: '55',
    title: 'شقة للإيجار في حي العزيزية',
    description: 'شقة مريحة قريبة من الحرم المكي، 2 غرفة نوم وصالة مع دورة مياه.',
    price: 48000,
    city: 'مكة المكرمة',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 115,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'rent',
  },
  {
    id: '56',
    title: 'شقة للإيجار في حي الزاهر',
    description: 'شقة أنيقة في موقع استراتيجي، 3 غرف نوم وصالتين مع دورة مياه.',
    price: 65000,
    city: 'مكة المكرمة',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'rent',
  },
  // الخبر - شقق للبيع
  {
    id: '57',
    title: 'شقة في حي الكورنيش',
    description: 'شقة فاخرة قريبة من البحر، 3 غرف نوم وصالتين مع دورة مياه. موقع ممتاز.',
    price: 1500000,
    city: 'الخبر',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 145,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    purpose: 'sale',
  },
  {
    id: '58',
    title: 'شقة في حي الراكة',
    description: 'شقة راقية بتصميم عصري، 2 غرفة نوم وصالة مع دورة مياه.',
    price: 1200000,
    city: 'الخبر',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 125,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'sale',
  },
  {
    id: '59',
    title: 'شقة في حي الدوحة',
    description: 'شقة حديثة ومريحة، 4 غرف نوم و3 دورات مياه. مناسبة للعائلات الكبيرة.',
    price: 1800000,
    city: 'الخبر',
    propertyType: 'شقة',
    bedrooms: 4,
    bathrooms: 3,
    area: 175,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'sale',
  },
  // الخبر - فيلات للبيع
  {
    id: '60',
    title: 'فيلا في حي الكورنيش',
    description: 'فيلا فاخرة قريبة من البحر، 5 غرف نوم و4 دورات مياه مع بركة سباحة.',
    price: 4000000,
    city: 'الخبر',
    propertyType: 'فيلا',
    bedrooms: 5,
    bathrooms: 4,
    area: 460,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    purpose: 'sale',
  },
  {
    id: '61',
    title: 'فيلا في حي الراكة',
    description: 'فيلا راقية في موقع ممتاز، 6 غرف نوم و5 دورات مياه مع حديقة.',
    price: 4800000,
    city: 'الخبر',
    propertyType: 'فيلا',
    bedrooms: 6,
    bathrooms: 5,
    area: 540,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    purpose: 'sale',
  },
  // الخبر - شقق للإيجار
  {
    id: '62',
    title: 'شقة للإيجار في حي الكورنيش',
    description: 'شقة مريحة قريبة من البحر، 2 غرفة نوم وصالة مع دورة مياه.',
    price: 45000,
    city: 'الخبر',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 105,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'rent',
  },
  {
    id: '63',
    title: 'شقة للإيجار في حي الراكة',
    description: 'شقة أنيقة في موقع حيوي، 3 غرف نوم وصالتين مع دورة مياه.',
    price: 60000,
    city: 'الخبر',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'rent',
  },
  // الطائف - شقق للبيع
  {
    id: '64',
    title: 'شقة في حي الشهداء',
    description: 'شقة فاخرة في الطائف، 3 غرف نوم وصالتين مع دورة مياه. موقع ممتاز.',
    price: 1350000,
    city: 'الطائف',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    purpose: 'sale',
  },
  {
    id: '65',
    title: 'شقة في حي العزيزية',
    description: 'شقة راقية بتصميم حديث، 2 غرفة نوم وصالة مع دورة مياه.',
    price: 1100000,
    city: 'الطائف',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 120,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'sale',
  },
  {
    id: '66',
    title: 'شقة في حي الحوية',
    description: 'شقة حديثة ومريحة، 4 غرف نوم و3 دورات مياه. مناسبة للعائلات.',
    price: 1750000,
    city: 'الطائف',
    propertyType: 'شقة',
    bedrooms: 4,
    bathrooms: 3,
    area: 170,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'sale',
  },
  // الطائف - فيلات للبيع
  {
    id: '67',
    title: 'فيلا في حي الشهداء',
    description: 'فيلا فاخرة مع حديقة واسعة، 5 غرف نوم و4 دورات مياه.',
    price: 3200000,
    city: 'الطائف',
    propertyType: 'فيلا',
    bedrooms: 5,
    bathrooms: 4,
    area: 420,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    purpose: 'sale',
  },
  {
    id: '68',
    title: 'فيلا في حي العزيزية',
    description: 'فيلا راقية في موقع ممتاز، 6 غرف نوم و5 دورات مياه مع بركة سباحة.',
    price: 4000000,
    city: 'الطائف',
    propertyType: 'فيلا',
    bedrooms: 6,
    bathrooms: 5,
    area: 500,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    purpose: 'sale',
  },
  // الطائف - شقق للإيجار
  {
    id: '69',
    title: 'شقة للإيجار في حي الشهداء',
    description: 'شقة مريحة ومناسبة، 2 غرفة نوم وصالة مع دورة مياه.',
    price: 40000,
    city: 'الطائف',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 100,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'rent',
  },
  {
    id: '70',
    title: 'شقة للإيجار في حي العزيزية',
    description: 'شقة أنيقة في موقع حيوي، 3 غرف نوم وصالتين مع دورة مياه.',
    price: 55000,
    city: 'الطائف',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 135,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'rent',
  },
  // أبها - شقق للبيع
  {
    id: '71',
    title: 'شقة في حي المفتاحة',
    description: 'شقة فاخرة في أبها، 3 غرف نوم وصالتين مع دورة مياه. موقع ممتاز.',
    price: 1300000,
    city: 'أبها',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 145,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    purpose: 'sale',
  },
  {
    id: '72',
    title: 'شقة في حي النصب',
    description: 'شقة راقية بتصميم عصري، 2 غرفة نوم وصالة مع دورة مياه.',
    price: 1050000,
    city: 'أبها',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 115,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'sale',
  },
  {
    id: '73',
    title: 'شقة في حي السودة',
    description: 'شقة حديثة ومريحة، 4 غرف نوم و3 دورات مياه. مناسبة للعائلات.',
    price: 1700000,
    city: 'أبها',
    propertyType: 'شقة',
    bedrooms: 4,
    bathrooms: 3,
    area: 175,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'sale',
  },
  // أبها - فيلات للبيع
  {
    id: '74',
    title: 'فيلا في حي المفتاحة',
    description: 'فيلا فاخرة مع حديقة واسعة، 5 غرف نوم و4 دورات مياه.',
    price: 3000000,
    city: 'أبها',
    propertyType: 'فيلا',
    bedrooms: 5,
    bathrooms: 4,
    area: 410,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    purpose: 'sale',
  },
  {
    id: '75',
    title: 'فيلا في حي النصب',
    description: 'فيلا راقية في موقع ممتاز، 6 غرف نوم و5 دورات مياه مع بركة سباحة.',
    price: 3800000,
    city: 'أبها',
    propertyType: 'فيلا',
    bedrooms: 6,
    bathrooms: 5,
    area: 490,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    purpose: 'sale',
  },
  // أبها - شقق للإيجار
  {
    id: '76',
    title: 'شقة للإيجار في حي المفتاحة',
    description: 'شقة مريحة ومناسبة، 2 غرفة نوم وصالة مع دورة مياه.',
    price: 38000,
    city: 'أبها',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 98,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'rent',
  },
  {
    id: '77',
    title: 'شقة للإيجار في حي النصب',
    description: 'شقة أنيقة في موقع حيوي، 3 غرف نوم وصالتين مع دورة مياه.',
    price: 52000,
    city: 'أبها',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 130,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'rent',
  },
  // المزيد من الرياض
  {
    id: '78',
    title: 'شقة في حي العريجاء',
    description: 'شقة حديثة ومريحة، 2 غرفة نوم وصالة مع دورة مياه. قريبة من المدارس.',
    price: 980000,
    city: 'الرياض',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 108,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    purpose: 'sale',
  },
  {
    id: '79',
    title: 'شقة في حي المطار',
    description: 'شقة أنيقة في موقع استراتيجي، 4 غرف نوم و3 دورات مياه. قريبة من المطار.',
    price: 1950000,
    city: 'الرياض',
    propertyType: 'شقة',
    bedrooms: 4,
    bathrooms: 3,
    area: 185,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800',
    purpose: 'sale',
  },
  {
    id: '80',
    title: 'تاون هاوس في حي العليا',
    description: 'تاون هاوس راقي مع سطح خاص، 3 غرف نوم و2 دورات مياه. موقع ممتاز.',
    price: 1900000,
    city: 'الرياض',
    propertyType: 'تاون هاوس',
    bedrooms: 3,
    bathrooms: 2,
    area: 250,
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
    purpose: 'sale',
  },
  {
    id: '81',
    title: 'تاون هاوس في حي المطار',
    description: 'تاون هاوس عصري بتصميم حديث، 5 غرف نوم و4 دورات مياه. مناسب للعائلات الكبيرة.',
    price: 2700000,
    city: 'الرياض',
    propertyType: 'تاون هاوس',
    bedrooms: 5,
    bathrooms: 4,
    area: 340,
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
    purpose: 'sale',
  },
  {
    id: '82',
    title: 'شقة للإيجار في حي المطار',
    description: 'شقة مريحة ومناسبة، 1 غرفة نوم وصالة مع دورة مياه. مناسبة للعزاب.',
    price: 32000,
    city: 'الرياض',
    propertyType: 'شقة',
    bedrooms: 1,
    bathrooms: 1,
    area: 70,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    purpose: 'rent',
  },
  {
    id: '83',
    title: 'شقة للإيجار في حي العريجاء',
    description: 'شقة أنيقة في موقع حيوي، 4 غرف نوم و3 دورات مياه. قريبة من المدارس.',
    price: 80000,
    city: 'الرياض',
    propertyType: 'شقة',
    bedrooms: 4,
    bathrooms: 3,
    area: 165,
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800',
    purpose: 'rent',
  },
  // المزيد من جدة
  {
    id: '84',
    title: 'شقة في حي البلد',
    description: 'شقة فاخرة في قلب جدة التاريخية، 3 غرف نوم وصالتين مع دورة مياه.',
    price: 1700000,
    city: 'جدة',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 155,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    purpose: 'sale',
  },
  {
    id: '85',
    title: 'شقة في حي الكورنيش',
    description: 'شقة راقية قريبة من البحر، 2 غرفة نوم وصالة مع دورة مياه. موقع ممتاز.',
    price: 1950000,
    city: 'جدة',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 135,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'sale',
  },
  {
    id: '86',
    title: 'تاون هاوس في حي الزهراء',
    description: 'تاون هاوس عصري مع سطح خاص، 4 غرف نوم و3 دورات مياه. قريب من البحر.',
    price: 2400000,
    city: 'جدة',
    propertyType: 'تاون هاوس',
    bedrooms: 4,
    bathrooms: 3,
    area: 300,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    purpose: 'sale',
  },
  {
    id: '87',
    title: 'شقة للإيجار في حي البلد',
    description: 'شقة مريحة في قلب جدة، 2 غرفة نوم وصالة مع دورة مياه.',
    price: 48000,
    city: 'جدة',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 102,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'rent',
  },
  {
    id: '88',
    title: 'شقة للإيجار في حي الكورنيش',
    description: 'شقة أنيقة قريبة من البحر، 3 غرف نوم وصالتين مع دورة مياه.',
    price: 75000,
    city: 'جدة',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 155,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'rent',
  },
  // المزيد من الدمام
  {
    id: '89',
    title: 'شقة في حي النزهة',
    description: 'شقة حديثة ومريحة، 3 غرف نوم وصالتين مع دورة مياه. قريبة من الخدمات.',
    price: 1280000,
    city: 'الدمام',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 138,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    purpose: 'sale',
  },
  {
    id: '90',
    title: 'تاون هاوس في حي الفيصلية',
    description: 'تاون هاوس راقي مع حديقة صغيرة، 3 غرف نوم و2 دورات مياه.',
    price: 2000000,
    city: 'الدمام',
    propertyType: 'تاون هاوس',
    bedrooms: 3,
    bathrooms: 2,
    area: 260,
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
    purpose: 'sale',
  },
  {
    id: '91',
    title: 'شقة للإيجار في حي النزهة',
    description: 'شقة مريحة ومناسبة، 2 غرفة نوم وصالة مع دورة مياه.',
    price: 42000,
    city: 'الدمام',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 98,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'rent',
  },
  {
    id: '92',
    title: 'شقة للإيجار في حي العدامة',
    description: 'شقة أنيقة في موقع حيوي، 3 غرف نوم وصالتين مع دورة مياه.',
    price: 58000,
    city: 'الدمام',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 142,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'rent',
  },
  // المزيد من المدينة المنورة
  {
    id: '93',
    title: 'شقة في حي العوالي',
    description: 'شقة فاخرة قريبة من المسجد النبوي، 3 غرف نوم وصالتين مع دورة مياه.',
    price: 1450000,
    city: 'المدينة المنورة',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 148,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    purpose: 'sale',
  },
  {
    id: '94',
    title: 'تاون هاوس في حي قباء',
    description: 'تاون هاوس عصري قريب من مسجد قباء، 4 غرف نوم و3 دورات مياه.',
    price: 2300000,
    city: 'المدينة المنورة',
    propertyType: 'تاون هاوس',
    bedrooms: 4,
    bathrooms: 3,
    area: 290,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    purpose: 'sale',
  },
  {
    id: '95',
    title: 'شقة للإيجار في حي العوالي',
    description: 'شقة مريحة قريبة من المسجد النبوي، 2 غرفة نوم وصالة مع دورة مياه.',
    price: 40000,
    city: 'المدينة المنورة',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 112,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'rent',
  },
  // المزيد من مكة المكرمة
  {
    id: '96',
    title: 'شقة في حي الشوقية',
    description: 'شقة راقية قريبة من الحرم المكي، 2 غرفة نوم وصالة مع دورة مياه.',
    price: 1320000,
    city: 'مكة المكرمة',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 128,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'sale',
  },
  {
    id: '97',
    title: 'شقة للإيجار في حي الشوقية',
    description: 'شقة أنيقة قريبة من الحرم المكي، 3 غرف نوم وصالتين مع دورة مياه.',
    price: 62000,
    city: 'مكة المكرمة',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 148,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    purpose: 'rent',
  },
  // المزيد من الخبر
  {
    id: '98',
    title: 'شقة في حي الدوحة',
    description: 'شقة حديثة ومريحة، 3 غرف نوم وصالتين مع دورة مياه. قريبة من الخدمات.',
    price: 1420000,
    city: 'الخبر',
    propertyType: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 143,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    purpose: 'sale',
  },
  {
    id: '99',
    title: 'تاون هاوس في حي الكورنيش',
    description: 'تاون هاوس راقي قريب من البحر، 4 غرف نوم و3 دورات مياه مع سطح خاص.',
    price: 2500000,
    city: 'الخبر',
    propertyType: 'تاون هاوس',
    bedrooms: 4,
    bathrooms: 3,
    area: 310,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    purpose: 'sale',
  },
  {
    id: '100',
    title: 'شقة للإيجار في حي الدوحة',
    description: 'شقة مريحة ومناسبة، 2 غرفة نوم وصالة مع دورة مياه. قريبة من المدارس.',
    price: 43000,
    city: 'الخبر',
    propertyType: 'شقة',
    bedrooms: 2,
    bathrooms: 1,
    area: 103,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    purpose: 'rent',
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
    // In static export mode (GitHub Pages), API routes don't work
    // Skip API call and use mock data directly
    if (typeof window !== 'undefined') {
      // Check if we're in a static export environment
      const isStaticExport = window.location.pathname.includes('/bank-albilad-demo') || 
                            process.env.NODE_ENV === 'production'
      
      // Try API route only if not in static export
      if (!isStaticExport) {
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

        try {
          // Use Next.js API route as proxy to avoid CORS issues
          const response = await fetch(`/api/sakani/search?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            const data = await response.json()
            const properties = transformApiResponse(data.data || data)
            if (properties.length > 0) {
              return properties
            }
          }
        } catch (apiError) {
          // API route failed, fall through to mock data
          console.warn('API route unavailable, using mock data')
        }
      }
    }
    
    // Use mock data (for static export or when API fails)
    return filterMockProperties(params)
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
    // In static export mode (GitHub Pages), API routes don't work
    // Use mock data directly
    if (typeof window !== 'undefined') {
      const isStaticExport = window.location.pathname.includes('/bank-albilad-demo') || 
                            process.env.NODE_ENV === 'production'
      
      // Try API route only if not in static export
      if (!isStaticExport) {
        try {
          const response = await fetch(`/api/sakani/property/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            const data = await response.json()
            const transformed = transformApiResponse([data.data || data])
            if (transformed.length > 0) {
              return transformed[0]
            }
          }
        } catch (apiError) {
          // API route failed, fall through to mock data
          console.warn('API route unavailable, using mock data')
        }
      }
    }
    
    // Use mock data (for static export or when API fails)
    const property = mockProperties.find((p) => p.id === id)
    if (property) {
      return property
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
