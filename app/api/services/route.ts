import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const section = url.searchParams.get('section') || 'gallery';

    // Get all unique service types for the section
    const services = await prisma.image.findMany({
      where: {
        section,
        service: {
          not: null,
        },
      },
      distinct: ['service'],
      select: {
        service: true,
      },
      orderBy: {
        service: 'asc',
      },
    });

    const serviceNames = services.map(s => s.service).filter(Boolean);

    return NextResponse.json(serviceNames, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Don't cache - always fetch fresh
      },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ message: "Failed to fetch services" }, { status: 500 });
  }
}
