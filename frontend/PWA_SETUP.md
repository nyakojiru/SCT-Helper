# PWA Setup Instructions

## Installation

1. Install the PWA plugin:
```bash
cd frontend
npm install
```

## PWA Icons

You need to create two icon files in `frontend/public/`:
- `pwa-192x192.png` (192x192 pixels)
- `pwa-512x512.png` (512x512 pixels)

### Creating Icons

You can create these icons using any image editor. The icons should:
- Use the app's color palette (sage teal #7FB3A8, soft backgrounds)
- Be simple and recognizable
- Work well at small sizes (192x192)
- Be maskable (safe area for Android)

### Quick Icon Creation

If you don't have icons ready, you can:
1. Use an online icon generator
2. Create a simple logo with the app name "SCT"
3. Use a placeholder service temporarily

## Features Implemented

✅ **Service Worker** - Automatic caching and offline support
✅ **Manifest** - App metadata and install configuration
✅ **Install Prompt** - User-friendly install button
✅ **Offline Fallback** - Offline page when connection is lost
✅ **Auto-update** - Service worker updates automatically
✅ **Runtime Caching** - API calls and images are cached

## Testing PWA

1. Build the app:
```bash
npm run build
```

2. Preview the build:
```bash
npm run preview
```

3. Open Chrome DevTools → Application tab:
   - Check "Service Workers" - should show registered
   - Check "Manifest" - should show app details
   - Check "Application" → "Storage" - verify caching

4. Test offline:
   - Open DevTools → Network tab
   - Check "Offline" checkbox
   - Refresh page - should show offline page or cached content

5. Test install:
   - Look for install prompt (appears after a few seconds)
   - Or use Chrome menu → "Install SCT Helper"

## Production Deployment

When deploying to production:
1. Ensure HTTPS is enabled (required for PWA)
2. Icons must be accessible at `/pwa-192x192.png` and `/pwa-512x512.png`
3. Service worker will be automatically generated in `dist/`
4. Manifest will be automatically generated

## Notes

- The old `sw.js` in `public/` will be replaced by vite-plugin-pwa's generated service worker
- The manifest in `vite.config.js` takes precedence over `public/manifest.json`
- Service worker updates automatically when you deploy new versions

