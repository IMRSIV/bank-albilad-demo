# Bank AlBilad - Sakani Real Estate Search Demo

A front-end demo application for Bank AlBilad that integrates with Sakani's real estate platform to search and display property listings.

## Features

- 🔍 **Property Search**: Search for real estate properties with text queries
- 🎯 **Advanced Filters**: Filter by city, property type, price range, bedrooms, and purpose (sale/rent)
- 📱 **Property Details**: View detailed information about each property
- 🎨 **Bank AlBilad Branding**: Custom theming with Bank AlBilad colors and logo
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🌐 **RTL Support**: Full Arabic language support with RTL layout

## Bank AlBilad Branding

The application uses Bank AlBilad's official color scheme:
- **Primary Color**: #7C6E66 (Shadow Cliff)
- **Accent Color**: #F6B430 (NYC Taxi)
- **Red Color**: #D01A2A (Splatter Movie)

## Sakani API Integration

The application demonstrates how to integrate with Sakani's API. The API service layer is located in `services/sakaniApi.ts` and shows:

### Request Structure

```typescript
GET /api/v1/properties/search
Headers:
  Authorization: Bearer {token}
  Content-Type: application/json
Query Parameters:
  ?query=شقة&city=الرياض&propertyType=شقة&minPrice=500000&maxPrice=2000000&bedrooms=3&purpose=sale&page=1&limit=20
```

### Response Structure

```json
{
  "success": true,
  "data": [
    {
      "id": "prop_123",
      "title": "شقة فاخرة في حي النرجس",
      "description": "...",
      "price": 1500000,
      "city": "الرياض",
      "propertyType": "شقة",
      "bedrooms": 3,
      "bathrooms": 2,
      "area": 150,
      "image": "https://...",
      "purpose": "sale",
      "location": {
        "latitude": 24.7136,
        "longitude": 46.6753
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
bankAlBilad_sakani_demo/
├── app/
│   ├── globals.css          # Global styles with Bank AlBilad theme
│   ├── layout.tsx            # Root layout with header
│   ├── page.tsx             # Home page with search and listings
│   └── property/
│       └── [id]/
│           └── page.tsx     # Property details page
├── components/
│   ├── Header.tsx           # Bank AlBilad header with logo
│   ├── SearchBar.tsx       # Search input component
│   ├── FilterPanel.tsx     # Filter sidebar component
│   └── PropertyCard.tsx    # Property card component
├── services/
│   └── sakaniApi.ts        # Sakani API service layer
└── package.json
```

## API Integration

The application is now configured to use the real Sakani API! 

### Quick Setup

1. **Create `.env.local` file** in the root directory:
   ```env
   NEXT_PUBLIC_SAKANI_API_BASE_URL=https://api.sakani.sa/api/v1
   NEXT_PUBLIC_SAKANI_API_KEY=your_api_key_here
   # OR use Bearer token:
   # NEXT_PUBLIC_SAKANI_API_TOKEN=your_bearer_token_here
   NEXT_PUBLIC_USE_MOCK_DATA=false
   ```

2. **Get API credentials** from Sakani platform

3. **Restart the dev server** after updating `.env.local`

### Current Status

- ✅ **Real API Integration**: The code is ready to connect to Sakani's API
- ✅ **Automatic Fallback**: Falls back to mock data if API is unavailable
- ✅ **Multiple Endpoints**: Tries common API endpoint patterns automatically
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **Response Transformation**: Adapts API responses to our data structure

### Mock Data Mode

By default, the app uses mock data. To switch to real API:
1. Set `NEXT_PUBLIC_USE_MOCK_DATA=false` in `.env.local`
2. Add your API credentials
3. Restart the server

See `API_SETUP.md` for detailed setup instructions.

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client (ready for API integration)

## License

This is a demo project for Bank AlBilad.

