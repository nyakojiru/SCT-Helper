# Troubleshooting: App Not Loading

## Quick Fixes

### 1. Clear Cache and Restart
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 2. Check for Console Errors
Open browser DevTools (F12) and check:
- **Console tab**: Look for red error messages
- **Network tab**: Check if files are loading (status 200)
- **Application tab**: Check Service Workers status

### 3. Verify Icons Exist
Make sure these files exist in `frontend/public/`:
- `pwa-192x192.png`
- `pwa-512x512.png`

### 4. Check Vite Dev Server
The dev server should show:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://0.0.0.0:3000/
```

## Common Issues

### Issue: "Cannot find module 'virtual:pwa-register'"
**Solution**: This is now fixed - we're using `injectRegister: 'auto'` which handles registration automatically.

### Issue: Icons not found
**Solution**: 
1. Verify icons are in `frontend/public/` (not `frontend/src/`)
2. Check file names match exactly: `pwa-192x192.png` and `pwa-512x512.png`
3. Ensure files are actual PNG images

### Issue: Service Worker errors
**Solution**:
1. Open DevTools → Application → Service Workers
2. Click "Unregister" on any old service workers
3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Clear cache and reload

### Issue: Build errors
**Solution**:
```bash
cd frontend
npm run build
```
Check for any error messages and fix them.

## Testing Steps

1. **Start dev server**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open browser**: Navigate to `http://localhost:3000`

3. **Check console**: Open DevTools (F12) → Console tab

4. **Verify PWA**:
   - DevTools → Application → Manifest (should show app details)
   - DevTools → Application → Service Workers (should show registered)

## Still Not Working?

1. Check if backend is running (app needs API)
2. Verify environment variables in `.env` file
3. Check browser compatibility (Chrome/Edge recommended for PWA)
4. Try incognito/private window to rule out extensions

