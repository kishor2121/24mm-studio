# Gallery Filter by Couple/Event - Setup Guide

## Overview
Your photography studio can now organize photos by couple/event names (e.g., "Manjunath & Ramya", "Arjun & Jasmeet", "Asha & Rohith"). When visitors browse the gallery, they'll see a dropdown to filter photos by specific couples/events.

---

## How to Upload Photos with Event Names

### Step 1: Go to Upload Page
- Click on "Dashboard" → "Upload"
- Login with your photographer credentials

### Step 2: Fill the Form
When uploading a photo, you'll see these fields:

1. **Media Type**: Select "Image" or "Video"
2. **Display Section**: Choose between:
   - `Gallery` (default) - Shows in the main gallery
   - `Home` - Shows on the home page banner
3. **Service Type**: Select the type of service (Wedding, Engagement, etc.)
4. **Event Name** ⭐ **← THIS IS IMPORTANT**
   - Enter the couple/event name here
   - Examples: "Manjunath & Ramya", "Arjun & Jasmeet", "Asha & Rohith"
   - Be consistent! Use the SAME name for all photos from the same event

### Step 3: Upload
- Select your image/video file
- Click "Upload"
- The photo is now tagged with that event name

---

## How Visitors See the Filtered Gallery

### Step 1: Visit Gallery
- Visitors go to the Gallery page
- They see all photos organized in a grid

### Step 2: Use the Filter Dropdowns
Two filter dropdowns appear at the top:

1. **"Filter by Couple/Event"** 
   - Options: All Events, Manjunath & Ramya, Arjun & Jasmeet, Asha & Rohith, etc.
   
2. **"Filter by Service Type"** ⭐ **NEW**
   - Options: All Services, Wedding, Engagement, Pre-Wedding, Maternity, Baby Shower, etc.

### Step 3: Browse Filtered Photos
- Select a couple/event name AND/OR service type
- Gallery shows ONLY photos matching the selected filters
- Combine filters: "Arjun & Jasmeet" + "Wedding" = Only wedding photos of that couple

**Example Filters:**
- `All Events` + `All Services` = Show ALL photos
- `Arjun & Jasmeet` + `All Services` = Only Arjun & Jasmeet photos (any service)
- `All Events` + `Wedding` = All couple photos from Wedding service only
- `Arjun & Jasmeet` + `Wedding` = Only Arjun & Jasmeet wedding photos

---

## Best Practices

### ✅ DO:
- Use consistent couple/event names across all uploads
- Format: "Name1 & Name2" (e.g., "Arjun & Jasmeet")
- Or use event descriptions like "Arjun & Jasmeet - Wedding Reception"
- Upload all photos from the same event with the same event name

### ❌ DON'T:
- Use different names for photos from the same event (e.g., "Arjun & Jasmeet" vs "Arjun and Jasmeet")
- Leave the event name blank (optional but recommended)
- Use very long event names

---

## Example Workflow

### Uploading 50 photos from Arjun & Jasmeet's Wedding:

1. Photo 1: 
   - Event Name: "Arjun & Jasmeet"
   - Service: "Wedding"
   
2. Photo 2: 
   - Event Name: "Arjun & Jasmeet" ← **Same name!**
   - Service: "Wedding"

3. Photo 3: 
   - Event Name: "Arjun & Jasmeet" ← **Same name!**
   - Service: "Wedding"

... and so on for all 50 photos

**Result in Gallery:**
- All 50 photos are automatically grouped together
- Visitors filter by "Arjun & Jasmeet" → See all 50 photos
- Visitors filter by "Arjun & Jasmeet" + "Wedding" → See all 50 photos
- Visitors filter by "Wedding" (without event name) → See all Wedding photos from ALL couples

### Uploading photos from MULTIPLE events with MIXED service types:

```
Upload 1: "Arjun & Jasmeet" + "Wedding" (50 photos)
Upload 2: "Arjun & Jasmeet" + "Engagement" (20 photos)
Upload 3: "Manjunath & Ramya" + "Wedding" (40 photos)
Upload 4: "Asha & Rohith" + "Pre-Wedding" (30 photos)
```

**Possible Gallery Filters:**
- `All Events` + `All Services` = 140 photos total
- `Arjun & Jasmeet` + `All Services` = 70 photos (both Wedding + Engagement)
- `Arjun & Jasmeet` + `Wedding` = 50 photos (only Wedding)
- `All Events` + `Wedding` = 90 photos (Arjun Wedding 50 + Manjunath Wedding 40)
- `Manjunath & Ramya` + `Wedding` = 40 photos

---

## Database Structure

Behind the scenes, each photo stores:
- `url` - The photo URL on Cloudinary
- `section` - "home" or "gallery"
- `service` - Type of service (Wedding, Engagement, etc.)
- `eventName` - **Couple/Event name** ← Filters by this
- `photographerId` - Your photographer ID

---

## Troubleshooting

### Q: I uploaded photos but don't see a dropdown in the gallery
**A:** Only show if you have photos with event names. Make sure you filled in the "Event Name" field during upload.

### Q: My filter shows duplicate events
**A:** Use consistent naming. For example, don't use both "Arjun & Jasmeet" and "arjun & jasmeet" (different case).

### Q: I want to change an event name
**A:** Contact your developer to update the database directly, or re-upload photos with the correct name.

### Q: Can I filter by multiple criteria?
**A:** Currently: Event Name (main filter). Service type filtering available in the code but can be added to UI if needed.

---

## API Endpoints (For Developers)

### Get Photos for an Event
```
GET /api/images?section=gallery&eventName=Arjun%20%26%20Jasmeet
```

### Get All Event Names
```
GET /api/events?section=gallery
```

Returns: `["Arjun & Jasmeet", "Manjunath & Ramya", "Asha & Rohith", ...]`

### Get All Service Types
```
GET /api/services?section=gallery
```

Returns: `["Wedding", "Engagement", "Pre-Wedding", "Maternity", "Baby Shower", ...]`

### Combined Filtering
```
GET /api/images?section=gallery&eventName=Arjun%20%26%20Jasmeet&service=Wedding
```

Returns only Wedding photos of Arjun & Jasmeet

---

## Next Steps

1. ✅ Start uploading photos with event names
2. ✅ Visitors will see the filter dropdown automatically
3. ✅ Test with your gallery to ensure it works
4. ✅ Share the gallery URL with your clients

Enjoy your organized gallery! 🎉
