import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, name, text, rating, imageId, videoId } = body;

    // Support both old format (content, imageId, videoId) and new format (name, text)
    const reviewContent = content || text;
    const reviewerName = name || "Anonymous";
    const reviewRating = Math.min(Math.max(parseInt(rating) || 5, 1), 5); // Ensure rating is between 1-5

    if (!reviewContent) {
      return NextResponse.json({ message: "Review content is required" }, { status: 400 });
    }

    // Only validate image/video if provided
    if (imageId) {
      const image = await prisma.image.findUnique({ where: { id: imageId } });
      if (!image) {
        return NextResponse.json({ message: "Image not found" }, { status: 404 });
      }
    }

    if (videoId) {
      const video = await prisma.video.findUnique({ where: { id: videoId } });
      if (!video) {
        return NextResponse.json({ message: "Video not found" }, { status: 404 });
      }
    }

    // Create the review (testimonial)
    const review = await prisma.review.create({
      data: {
        content: reviewContent,
        name: reviewerName,
        rating: reviewRating,
        imageId: imageId || null,
        videoId: videoId || null,
      },
    });

    return NextResponse.json(review, { status: 201 });

  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json({ message: "Failed to create review" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get('imageId');
    const videoId = searchParams.get('videoId');

    let reviews;

    if (imageId) {
      reviews = await prisma.review.findMany({
        where: { imageId: parseInt(imageId) },
        orderBy: { createdAt: 'desc' },
      });
    } else if (videoId) {
      reviews = await prisma.review.findMany({
        where: { videoId: parseInt(videoId) },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Get all reviews (both testimonials and media reviews)
      reviews = await prisma.review.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(reviews);

  } catch (error) {
    console.error('Review retrieval error:', error);
    return NextResponse.json({ message: "Failed to retrieve reviews" }, { status: 500 });
  }
}
