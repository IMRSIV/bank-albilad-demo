import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_SAKANI_API_BASE_URL || 'https://api.sakani.sa/api/v1'
const API_KEY = process.env.NEXT_PUBLIC_SAKANI_API_KEY
const API_TOKEN = process.env.NEXT_PUBLIC_SAKANI_API_TOKEN

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Build query parameters
    const queryParams: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      queryParams[key] = value
    })

    // Try different possible endpoints
    const possibleEndpoints = [
      '/properties/search',
      '/marketplace/search',
      '/listings/search',
      '/api/properties',
      '/api/marketplace',
      '/public/properties',
      '/public/marketplace',
      '/guest/properties',
      '/v1/properties',
      '/v1/marketplace',
    ]

    let lastError: any = null

    for (const endpoint of possibleEndpoints) {
      try {
        const url = new URL(endpoint, API_BASE_URL)
        Object.keys(queryParams).forEach(key => {
          if (queryParams[key]) {
            url.searchParams.append(key, queryParams[key])
          }
        })

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': 'ar',
          'User-Agent': 'Mozilla/5.0 (compatible; BankAlBilad/1.0)',
        }

        if (API_KEY) {
          headers['X-API-Key'] = API_KEY
        }

        if (API_TOKEN) {
          headers['Authorization'] = `Bearer ${API_TOKEN}`
        }

        // If no credentials, add guest headers
        if (!API_KEY && !API_TOKEN) {
          headers['X-Requested-With'] = 'XMLHttpRequest'
          headers['Referer'] = 'https://sakani.sa'
        }

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers,
          // Don't follow redirects automatically
          redirect: 'follow',
        })

        if (response.ok) {
          const data = await response.json()
          return NextResponse.json(data, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            },
          })
        }

        // If 404, try next endpoint
        if (response.status === 404) {
          continue
        }

        // If auth error, don't try other endpoints
        if (response.status === 401 || response.status === 403) {
          return NextResponse.json(
            { error: 'Authentication required', status: response.status },
            { status: response.status }
          )
        }

      } catch (error: any) {
        lastError = error
        // Continue to next endpoint
        continue
      }
    }

    // If all endpoints failed, return error
    return NextResponse.json(
      { 
        error: 'No valid API endpoint found',
        details: lastError?.message || 'All endpoints failed',
        fallback: true 
      },
      { status: 404 }
    )

  } catch (error: any) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        fallback: true 
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

