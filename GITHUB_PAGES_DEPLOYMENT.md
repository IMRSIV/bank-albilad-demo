# GitHub Pages Deployment Guide

This guide explains how to deploy the Bank AlBilad Sakani demo to GitHub Pages.

## Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically builds and deploys the site when you push to the `main` branch.

### Setup Steps:

1. **Enable GitHub Pages in your repository:**
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages"
   git push origin main
   ```

3. **Wait for deployment:**
   - Go to the "Actions" tab in your repository
   - The workflow will automatically build and deploy
   - Once complete, your site will be available at: `https://imrsiv.github.io/bank-albilad-demo/`

## Manual Deployment

If you prefer to deploy manually:

1. **Build the static site:**
   ```bash
   npm run build
   ```

2. **The build output will be in the `out` directory**

3. **Push the `out` directory to the `gh-pages` branch:**
   ```bash
   git subtree push --prefix out origin gh-pages
   ```

   Or if using a separate branch:
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   cp -r out/* .
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

4. **Configure GitHub Pages:**
   - Go to repository Settings → Pages
   - Select the `gh-pages` branch as the source
   - Save

## Important Notes

- The app is configured with base path `/bank-albilad-demo` to match the repository name
- API routes are disabled in static export mode (uses mock data)
- All 100 properties are pre-rendered at build time
- The site works entirely client-side with mock data

## Troubleshooting

### Site shows README instead of app
- Make sure GitHub Pages is configured to use GitHub Actions or the `gh-pages` branch
- Check that the `out` directory contains the built files
- Verify the base path in `next.config.js` matches your repository name

### 404 errors on property pages
- Ensure `generateStaticParams` is working correctly
- Check that all property IDs (1-100) are being generated
- Verify the build completed successfully

### Images not loading
- Images are set to `unoptimized: true` for static export
- External images from Unsplash should work
- Bank AlBilad logo should load from their CDN

