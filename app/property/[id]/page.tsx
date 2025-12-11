import { getPropertyDetails } from '@/services/sakaniApi'
import PropertyDetailsClient from './PropertyDetailsClient'

// Generate static params for all 100 properties
export async function generateStaticParams() {
  return Array.from({ length: 100 }, (_, i) => ({
    id: String(i + 1),
  }))
}

interface PageProps {
  params: {
    id: string
  }
}

export default async function PropertyDetails({ params }: PageProps) {
  let initialProperty = null
  
  try {
    initialProperty = await getPropertyDetails(params.id)
  } catch (error) {
    console.error('Error fetching property:', error)
  }

  return <PropertyDetailsClient initialProperty={initialProperty} propertyId={params.id} />
}
