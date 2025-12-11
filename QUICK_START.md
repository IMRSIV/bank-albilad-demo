# Quick Start Guide

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Overview

This is a demo application that shows how Bank AlBilad can integrate with Sakani's real estate platform. The application includes:

- ✅ Property search functionality
- ✅ Advanced filtering (city, type, price, bedrooms, purpose)
- ✅ Property detail pages
- ✅ Bank AlBilad branding and theming
- ✅ RTL support for Arabic content
- ✅ Responsive design

## Current Implementation

The application currently uses **mock data** to demonstrate the structure and functionality. The API service layer in `services/sakaniApi.ts` shows:

1. **Request/Response Structure**: How API calls should be structured
2. **Type Definitions**: TypeScript interfaces for properties and search parameters
3. **Mock Implementation**: Working demo with sample properties

## Integrating with Real Sakani API

To connect to the actual Sakani API:

1. **Update API Configuration:**
   - Open `services/sakaniApi.ts`
   - Replace mock functions with actual API calls
   - Add authentication tokens/API keys
   - Update base URL if needed

2. **Example Real API Call:**
   ```typescript
   import axios from 'axios'
   
   const sakaniApi = axios.create({
     baseURL: 'https://api.sakani.sa/api/v1',
     headers: {
       'Authorization': `Bearer ${process.env.SAKANI_API_TOKEN}`,
       'Content-Type': 'application/json',
     },
   })
   
   export async function searchProperties(params: PropertySearchParams) {
     const response = await sakaniApi.get('/properties/search', { params })
     return response.data.data
   }
   ```

3. **Environment Variables:**
   Create a `.env.local` file:
   ```
   SAKANI_API_BASE_URL=https://api.sakani.sa/api/v1
   SAKANI_API_TOKEN=your_token_here
   ```

## Testing the Application

1. **Search Functionality:**
   - Type in the search bar (e.g., "شقة")
   - Results will filter based on your query

2. **Filters:**
   - Select city, property type, bedrooms
   - Set price range
   - Toggle between "للبيع" (sale) and "للإيجار" (rent)

3. **Property Details:**
   - Click on any property card
   - View full property information
   - Navigate back to search results

## Customization

### Colors
Edit `tailwind.config.js` to change Bank AlBilad colors:
```javascript
colors: {
  'bank-primary': '#7C6E66',
  'bank-accent': '#F6B430',
  'bank-red': '#D01A2A',
}
```

### Logo
Replace the logo placeholder in `components/Header.tsx` with the actual Bank AlBilad logo image.

## Next Steps

1. Obtain Sakani API credentials
2. Replace mock data with real API calls
3. Add error handling and loading states
4. Implement authentication if required
5. Add more features (favorites, comparisons, etc.)

## Support

For questions about:
- **Sakani API**: Contact Sakani platform support
- **Bank AlBilad Integration**: Contact Bank AlBilad development team

