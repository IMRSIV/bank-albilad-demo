import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_SAKANI_API_BASE_URL || 'https://api.sakani.sa/api/v1'
const API_KEY = process.env.NEXT_PUBLIC_SAKANI_API_KEY
const API_TOKEN = process.env.NEXT_PUBLIC_SAKANI_API_TOKEN

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const possibleEndpoints = [
      `/properties/${id}`,
      `/marketplace/${id}`,
      `/listings/${id}`,
      `/api/properties/${id}`,
      `/api/marketplace/${id}`,
      `/public/properties/${id}`,
      `/public/marketplace/${id}`,
      `/guest/properties/${id}`,
      `/v1/properties/${id}`,
      `/v1/marketplace/${id}`,
    ]

    let lastError: any = null

    for (const endpoint of possibleEndpoints) {
      try {
        const url = new URL(endpoint, API_BASE_URL)

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

        if (!API_KEY && !API_TOKEN) {
          headers['X-Requested-With'] = 'XMLHttpRequest'
          headers['Referer'] = 'https://sakani.sa'
        }

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers,
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

        if (response.status === 404) {
          continue
        }

        if (response.status === 401 || response.status === 403) {
          return NextResponse.json(
            { error: 'Authentication required', status: response.status },
            { status: response.status }
          )
        }

      } catch (error: any) {
        lastError = error
        continue
      }
    }

    return NextResponse.json(
      { 
        error: 'Property not found',
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

