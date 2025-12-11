import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Build query parameters for Sakani API
    const queryParams = new URLSearchParams()
    
    // Get search parameters
    const query = searchParams.get('query') || ''
    const city = searchParams.get('city') || ''
    const propertyType = searchParams.get('propertyType') || ''
    const purpose = searchParams.get('purpose') || 'buy' // buy or rent
    const minPrice = searchParams.get('minPrice') || ''
    const maxPrice = searchParams.get('maxPrice') || ''
    const bedrooms = searchParams.get('bedrooms') || ''
    
    // Try Sakani marketplace search API
    // First, try to get a list of projects/units
    const sakaniSearchUrl = new URL('https://sakani.sa/marketplaceApi/search/v3')
    
    // Build search query
    const searchQuery: any = {
      marketplace_purpose: purpose === 'rent' ? 'rent' : 'buy',
      product_types: ['units_under_construction', 'ready_units'],
      coordinates: [],
    }
    
    if (city) {
      searchQuery.city = city
    }
    
    if (propertyType) {
      // Map property types
      const typeMap: Record<string, string> = {
        'شقة': 'apartment',
        'فيلا': 'villa',
        'تاون هاوس': 'townhouse',
      }
      searchQuery.property_type = typeMap[propertyType] || propertyType
    }
    
    if (minPrice) {
      searchQuery.min_price = parseInt(minPrice)
    }
    
    if (maxPrice) {
      searchQuery.max_price = parseInt(maxPrice)
    }
    
    if (bedrooms) {
      searchQuery.bedrooms = parseInt(bedrooms)
    }
    
    // Try the search endpoint
    try {
      const response = await fetch('https://sakani.sa/marketplaceApi/search/v3', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'accept-language': 'ar',
          'app-locale': 'ar',
          'content-type': 'application/json',
          'platform': 'web',
          'referer': 'https://sakani.sa/app/marketplace',
          'user-agent': 'Mozilla/5.0 (compatible; BankAlBilad/1.0)',
        },
        body: JSON.stringify(searchQuery),
      })
      
      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        })
      }
    } catch (error) {
      console.error('Sakani search API error:', error)
    }
    
    // If search fails, try the location/details endpoint with sample project IDs
    const projectIds = [
      'project_1594', 'project_1629', 'project_1062', 'project_1458', 'project_1223',
      'project_1421', 'project_1220', 'project_1129', 'project_1227', 'project_1045',
      'project_1424', 'project_1455', 'project_1493', 'project_1437', 'project_1446',
      'project_1339', 'project_1415', 'project_684', 'project_1363', 'project_1452'
    ]
    
    const idsParam = projectIds.slice(0, 20).join(',')
    const detailsUrl = `https://sakani.sa/marketplaceApi/search/v3/location/details?ids=${idsParam}&filter[mode]=unit`
    
    try {
      const response = await fetch(detailsUrl, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'accept-language': 'ar',
          'app-locale': 'ar',
          'content-type': 'application/json',
          'platform': 'web',
          'referer': 'https://sakani.sa/app/marketplace',
          'user-agent': 'Mozilla/5.0 (compatible; BankAlBilad/1.0)',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        })
      }
    } catch (error) {
      console.error('Sakani details API error:', error)
    }
    
    // Return fallback flag
    return NextResponse.json(
      { error: 'API unavailable', fallback: true },
      { status: 503 }
    )
    
  } catch (error: any) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message, fallback: true },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

