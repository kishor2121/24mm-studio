import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const section = url.searchParams.get('section') || 'gallery';

    // Get all unique event names for the section
    const events = await prisma.image.findMany({
      where: {
        section,
        eventName: {
          not: null,
        },
      },
      distinct: ['eventName'],
      select: {
        eventName: true,
      },
      orderBy: {
        eventName: 'asc',
      },
    });

    const eventNames = events.map(e => e.eventName).filter(Boolean);

    return NextResponse.json(eventNames, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ message: "Failed to fetch events" }, { status: 500 });
  }
}
