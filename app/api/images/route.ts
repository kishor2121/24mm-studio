import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const images = await prisma.image.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        photographer: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ message: "Failed to fetch images" }, { status: 500 });
  }
}
