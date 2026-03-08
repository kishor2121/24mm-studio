# Quick Reference: Service & Event Name Feature

## 📋 Quick Setup

### Upload Multi-Couple Wedding in 3 Minutes

#### Couple 1 - Arjun & Jasmeet
```
Login → Upload
├─ Media: Image
├─ Section: Gallery
├─ Service: Wedding ← DROPDOWN
├─ Event Name: Arjun & Jasmeet ← TEXT INPUT
└─ Upload 20+ images
```

#### Couple 2 - Manjunath & Ramya
```
Same process:
├─ Event Name: Manjunath & Ramya ← DIFFERENT NAME
└─ Upload 18+ images
```

#### Couple 3 - Asha & Rohith (Featured)
```
Same process BUT:
├─ Section: Home ← FEATURED ON HOMEPAGE
├─ Event Name: Asha & Rohith
└─ Upload 22+ images
```

---

## 🎯 Common Scenarios

### Scenario 1: Single Couple Wedding
```
Service: Wedding
Event Name: [Couple Name]
Section: Gallery
Upload all images together
```

### Scenario 2: Multi-Couple Wedding
```
For each couple:
- Same Service: Wedding
- Different Event Name (e.g., "Couple 1", "Couple 2")
- Upload separately
```

### Scenario 3: Engagement + Pre-Wedding
```
Engagement Shoot:
- Service: Engagement
- Event Name: [Couple Name]

Pre-Wedding:
- Service: Pre-Wedding
- Event Name: [Couple Name]
```

### Scenario 4: Portrait Portfolio
```
Portfolio Shoot:
- Service: Portfolio
- Event Name: [Model/Client Name]
- Section: Gallery
```

---

## 🛠️ Service Types (15 Total)

```
1. Wedding          6. Baby Shoot         11. Portfolio
2. Engagement       7. Birthday Shoot     12. Product Shoot
3. Pre-Wedding      8. Naming Ceremony    13. Corporate Events
4. Maternity        9. House Warming      14. Hamarlok Weddings
5. Baby Shower     10. Upanayana          15. Car/Bike Delivery Shoot
```

---

## 📊 Data Saved for Each Image

```
Image Data:
├─ URL (image link)
├─ Section (home or gallery)     [Existing]
├─ Service (Wedding, etc.)       [NEW]
├─ Event Name (Couple name)      [NEW]
├─ Photographer ID
└─ Created Date
```

---

## 🎓 Example: Wedding with 3 Couples

### Database After Upload:
```
Image 1-20:   service="Wedding", eventName="Arjun & Jasmeet"
Image 21-38:  service="Wedding", eventName="Manjunath & Ramya"
Image 39-60:  service="Wedding", eventName="Asha & Rohith", section="home"
```

### Gallery Display:
```
Gallery View (section=gallery):
- Shows images 1-38
- Each with couple name
- Can identify each couple

Home View (section=home):
- Shows images 39-60 (featured)
- Asha & Rohith images
```

---

## ✨ Key Benefits

| Before | After |
|--------|-------|
| 60 mixed images | 20 + 18 + 22 organized images |
| Can't tell couples apart | Each couple clearly identified |
| Hard to share couple's photos | Easy to filter by couple name |
| No service categorization | Can filter by event type |

---

## 🚀 Upload Tips

1. **Batch Upload**: Do all images of one couple at once
2. **Consistent Naming**: Use same format for couple names
3. **Feature Best**: Use section="home" for best couple
4. **Service Match**: Choose correct service type
5. **Event Name**: Required for grouping

---

## 🔍 View Uploaded Images

### In Gallery Page:
```
1. Select Category: Home or Gallery
2. Select Media: Images or Videos
3. View all images organized by couple
4. Click image to see reviews
```

---

## 📝 Form Fields Checklist

When uploading:

```
☐ Media Type: Image or Video
☐ Display Section: Home or Gallery
☐ Service Type: Choose from dropdown (required)
☐ Event Name: Enter couple/event name (required)
☐ Select File: Choose image/video
☐ Click Upload
```

---

## 💡 Pro Tips

**Tip 1**: Feature top 3 couples on home by using section="home"

**Tip 2**: Use same event name for consistency
- Good: "Arjun & Jasmeet"
- Bad: "Arjun and Jasmeet" (different)

**Tip 3**: Create a naming convention:
- All weddings: "FirstName & LastName"
- All engagements: "[FirstName] & [LastName] - Engagement"

**Tip 4**: Upload in order
1. Best couple first (home section)
2. Then other couples (gallery section)

**Tip 5**: Service type helps organize
- Separate Wedding from Engagement
- Easy to filter later

---

## 🎬 Video Upload

Same process, just:
```
☑ Video (instead of Image)
Service: Still required
Event Name: Still required
Upload video file
```

---

## ❓ FAQ

**Q: Can I upload images for same couple twice?**
A: Yes! Upload different photos with same event name.

**Q: Do I need to enter Event Name?**
A: For wedding couples, yes - helps identify them.

**Q: Can I change Event Name later?**
A: Currently no, but we can add edit feature.

**Q: What if I forget Event Name?**
A: It will be empty, but images still uploaded.

---

## 🔄 Workflow Summary

```
Upload Page
    ↓
Select File Type (Image/Video)
    ↓
Select Section (Home/Gallery)
    ↓
Select Service (15 types)
    ↓
Enter Event Name (Couple Name)
    ↓
Upload Button
    ↓
Saved to Database with all info
    ↓
View in Gallery Page
    ↓
Organized by Couple/Event!
```

---

## ✅ All Set!

Everything is ready to use. Just:

1. Login to Dashboard
2. Click Upload
3. Fill in the form
4. Upload images
5. View organized gallery

**Done! 🎉**

