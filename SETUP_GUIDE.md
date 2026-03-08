# 24mm STUDIO - Professional Photography Platform

A modern web application for photographers to upload and showcase images and videos, with a community review system.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
Make sure your `.env` file has:
```
DATABASE_URL=your_postgres_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
```

### 3. Create Database Schema
```bash
npx prisma migrate dev --name init
```

### 4. Seed Demo Data
```bash
npm run seed
```

This creates a demo photographer account:
- **Email**: karthi04@gmail.com
- **Password**: Karthik123

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Features

### 🏠 Homepage
- Professional landing page
- Navigation to Gallery and Upload
- Feature highlights
- Call-to-action sections

### 👤 Authentication
- **Login**: `/auth/login` - For photographers
- **Register**: `/auth/register` - Create new photographer account
- Session stored in localStorage
- Password hashing with bcrypt

### 📤 Upload Media
- **Route**: `/dashboard/upload`
- Upload images or videos to Cloudinary
- Only available to logged-in photographers
- File validation before upload
- Success/error feedback

### 📸 Gallery
- **Route**: `/dashboard/gallery`
- View all uploaded images and videos
- Tab-based navigation (Images/Videos)
- Real-time review system

### ⭐ Reviews
- Anyone can leave reviews (login not required)
- Review images or videos
- Timestamped reviews
- Read reviews by media item

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - Photographer login
- `POST /api/auth/register` - Register new photographer

### Media
- `POST /api/upload` - Upload image/video (requires auth)
- `GET /api/images` - Get all images
- `GET /api/videos` - Get all videos

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews` - Get reviews (with optional imageId/videoId filters)

## 🗄️ Database Schema

### Photographer
```prisma
model Photographer {
  id    Int     @id @default(autoincrement())
  name  String  @unique
  email String  @unique
  password String
  images Image[]
  videos Video[]
}
```

### Image
```prisma
model Image {
  id            Int        @id @default(autoincrement())
  url           String
  photographer  Photographer @relation(fields: [photographerId], references: [id])
  photographerId Int
  createdAt     DateTime   @default(now())
  reviews       Review[]
}
```

### Video
```prisma
model Video {
  id            Int        @id @default(autoincrement())
  url           String
  photographer  Photographer @relation(fields: [photographerId], references: [id])
  photographerId Int
  createdAt     DateTime   @default(now())
  reviews       Review[]
}
```

### Review
```prisma
model Review {
  id        Int     @id @default(autoincrement())
  content   String
  imageId   Int?
  videoId   Int?
  createdAt DateTime @default(now())
  image     Image?  @relation(fields: [imageId], references: [id])
  video     Video?  @relation(fields: [videoId], references: [id])
}
```

## 🎨 Styling

- **Framework**: Tailwind CSS v4
- **Color Scheme**: Dark theme with amber/gold accents
- **Responsive**: Mobile-first design
- **Typography**: Professional fonts with proper hierarchy

## 🔧 Build & Deploy

### Build
```bash
npm run build
```

### Start Production
```bash
npm start
```

## 📁 Project Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── login/route.ts
│   │   └── register/route.ts
│   ├── upload/route.ts
│   ├── images/route.ts
│   ├── videos/route.ts
│   └── reviews/route.ts
├── auth/
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/
│   ├── upload/page.tsx
│   └── gallery/page.tsx
├── layout.tsx
├── page.tsx
└── globals.css

lib/
└── prisma.ts

prisma/
├── schema.prisma
└── seed.ts
```

## 🔑 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/studio24mm

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret
```

## 🚀 Future Enhancements

- [ ] Email verification
- [ ] Photographer profiles
- [ ] Pagination for galleries
- [ ] Search and filtering
- [ ] Image editing tools
- [ ] Email notifications for reviews
- [ ] Social sharing
- [ ] Advanced analytics
- [ ] Multiple photographers management
- [ ] Payment integration

## 📞 Support

For issues or feature requests, please create an issue in the repository.

## 📄 License

This project is private and proprietary.
