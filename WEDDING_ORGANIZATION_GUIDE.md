# Wedding Image Organization Guide

## How to Organize Multiple Couples in One Wedding Event

### Scenario
If you shoot a wedding event with multiple couples/people, here's how to organize and display them:

### Example: Grand Wedding Event with 3 Couples

**Wedding Event Date:** March 15, 2026

#### Couple 1: Arjun & Jasmeet
Upload 15-20 images:
- **Service Type:** Wedding
- **Event Name:** `Arjun & Jasmeet`
- **Section:** Gallery (for gallery page)

#### Couple 2: Manjunath & Ramya
Upload 15-20 images:
- **Service Type:** Wedding
- **Event Name:** `Manjunath & Ramya`
- **Section:** Gallery

#### Couple 3: Asha & Rohith
Upload 15-20 images:
- **Service Type:** Wedding
- **Event Name:** `Asha & Rohith`
- **Section:** Home (if you want to feature on homepage)

---

## Database Structure

Each image has these fields:

```
Image {
  id: number
  url: string (image link)
  section: string (home / gallery)
  service: string (Wedding, Engagement, etc.)
  eventName: string (Couple or Event Name)
  photographerId: number
  createdAt: date
}
```

---

## How to Display in Gallery

The gallery page will show:

### Option 1: Filter by Service + Event Name
```
Gallery → Wedding → Show All "Arjun & Jasmeet" images
Gallery → Wedding → Show All "Manjunath & Ramya" images
Gallery → Engagement → Show All engagement images
```

### Option 2: Display as Showcase Cards
Each couple gets a card with:
- Featured image
- Couple name: "ARJUN & JASMEET"
- Number of images: "20 photos"
- View gallery link

---

## Upload Example Workflow

### Step 1: Upload First Couple Images
1. Go to Dashboard → Upload
2. Select Image
3. Display Section: **Gallery**
4. Service Type: **Wedding**
5. Event Name: **Arjun & Jasmeet**
6. Upload image 1, 2, 3... (repeat for all images)

### Step 2: Upload Second Couple Images
1. Go to Dashboard → Upload
2. Select Image
3. Display Section: **Gallery**
4. Service Type: **Wedding**
5. Event Name: **Manjunath & Ramya**
6. Upload image 1, 2, 3... (repeat for all images)

### Step 3: Upload Third Couple Images
1. Go to Dashboard → Upload
2. Select Image
3. Display Section: **Home** (to show on homepage)
4. Service Type: **Wedding**
5. Event Name: **Asha & Rohith**
6. Upload image 1, 2, 3... (repeat for all images)

---

## Gallery Page Display

The gallery will have filters:

```
Category Tabs:
├─ HOME (shows only "section: home")
└─ GALLERY (shows only "section: gallery")

Media Type Tabs:
├─ IMAGES
└─ VIDEOS

Service Filter (Future Enhancement):
├─ Wedding
├─ Engagement
├─ Pre-Wedding
└─ ... (all services)

Event Name Display:
Shows "ARJUN & JASMEET" label on each image/group
```

---

## Benefits of This Structure

✅ **Organization:** All couple images grouped together
✅ **Easy Navigation:** Filter by service, then by couple name
✅ **Portfolio Showcase:** Each couple gets their own mini-portfolio
✅ **Homepage Featured:** Can highlight specific couples
✅ **Scalability:** Handle multiple events per day

---

## Future Enhancement: Event Grouping

To make it even better, we can add an `eventDate` field:

```
eventDate: "2026-03-15"  // Groups all couples from same event
```

This would create a portfolio view like:
```
Wedding Portfolio: March 15, 2026
├─ Arjun & Jasmeet (20 photos)
├─ Manjunath & Ramya (18 photos)
└─ Asha & Rohith (22 photos)
```

---

## Current Upload Form

When uploading, you'll see:

```
Media Type: [ Image ] [ Video ]

Display Section:
┌─────────────────────┐
│ Gallery (default)   │
│ Home                │
└─────────────────────┘

Service Type:
┌─────────────────────┐
│ Wedding (selected)  │
│ Engagement          │
│ Pre-Wedding         │
│ Maternity           │
│ ... 11 more         │
└─────────────────────┘

Event Name:
[Enter couple/event name...]
"This helps organize multiple couple images from the same event"

Choose Image File:
[Drag and drop or click to select]
```

---

## Tips

1. **Consistency:** Use the same event name spelling (e.g., "Arjun & Jasmeet" not "Arjun and Jasmeet")
2. **Order:** Upload them in a logical order (bride's photos, groom's photos, together photos)
3. **Naming:** Consider the order couples should appear
4. **Featured:** Use `section: home` for your best couple images

