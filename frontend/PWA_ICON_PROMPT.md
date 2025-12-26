# PWA Icon Generation Prompt for Grok

Use this prompt in Grok to generate your PWA icons:

## Prompt for Grok:

```
Create a PWA app icon for a mental health tracking application called "SCT Helper" (Sluggish Cognitive Tempo Helper). 

Design requirements:
- App name: "SCT Helper" or just "SCT"
- Purpose: Cognitive wellness and mental health tracking app
- Style: Calming, minimalist, modern, professional
- Color palette: 
  * Primary: Sage teal (#7FB3A8) 
  * Background: Soft light gray-blue (#F5F7FA or #E8EDF2)
  * Accent: Soft lavender (#B8A9C9) or soft mint (#A5C9C7)
- Design elements: Consider incorporating subtle symbols like:
  * A brain or mind icon (stylized, not too detailed)
  * A tracking/chart line
  * A leaf or nature element (for calmness)
  * Or simply elegant typography with "SCT"
- Mood: Peaceful, supportive, trustworthy, clean
- Avoid: Bright neon colors, aggressive designs, cluttered layouts

Technical specifications:
- Generate TWO versions:
  1. 192x192 pixels, PNG format
  2. 512x512 pixels, PNG format
- Both must be square
- Design should work well at small sizes (readable at 192x192)
- Must be maskable (important content in center 80% safe area for Android)
- Transparent or solid background acceptable
- High quality, crisp edges, no blur

The icon should convey: mental wellness, tracking progress, calm support, cognitive health.
```

## Alternative Shorter Prompt:

```
Design a calming PWA icon for "SCT Helper" - a mental health tracking app. 
Use sage teal (#7FB3A8) as primary color on soft light background (#F5F7FA). 
Minimalist design with brain/mind symbol or elegant "SCT" typography. 
Peaceful, professional, trustworthy aesthetic. 
Generate 192x192px and 512x512px PNG versions, maskable design.
```

## Additional Tips:

1. **If Grok supports it, specify:**
   - "Create a maskable icon" (Android requirement)
   - "Ensure text/important elements are within the center 80% of the image"
   - "Design should be recognizable at 24x24 pixels"

2. **For better results, you can also try:**
   - "Create an app icon in the style of Headspace or Calm apps"
   - "Modern mental health app icon, similar to meditation apps"
   - "Minimalist wellness tracking icon"

3. **After generation:**
   - Save as `pwa-192x192.png` and `pwa-512x512.png`
   - Place both files in `frontend/public/` directory
   - Verify they look good at small sizes

## Quick Test:

After generating, test the icons by:
1. Opening them in an image viewer
2. Zooming out to see how they look at small sizes
3. Checking that text/elements are readable at 192x192

