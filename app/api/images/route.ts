import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const section = url.searchParams.get('section');

    const whereClause = section ? { section } : undefined;

    const images = await prisma.image.findMany({
      where: whereClause,
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
