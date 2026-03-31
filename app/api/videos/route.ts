import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        photographer: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(videos, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Don't cache - always fetch fresh
      },
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ message: "Failed to fetch videos" }, { status: 500 });
  }
}
