import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const section = url.searchParams.get('section');
    const eventName = url.searchParams.get('eventName');

    const whereClause: any = {};
    if (section) whereClause.section = section;
    if (eventName) whereClause.eventName = eventName;

    const images = await prisma.image.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        photographer: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(images, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ message: "Failed to fetch images" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const photographerHeader = req.headers.get('x-photographer');
    if (!photographerHeader) {
      return NextResponse.json({ message: 'Photographer required' }, { status: 401 });
    }

    let photographer;
    try {
      const data = JSON.parse(photographerHeader);
      photographer = await prisma.photographer.findUnique({ where: { id: data.id } });
      if (!photographer) {
        return NextResponse.json({ message: 'Photographer not found' }, { status: 404 });
      }
    } catch (err) {
      return NextResponse.json({ message: 'Invalid photographer data' }, { status: 400 });
    }

    const url = new URL(req.url);
    const imageId = url.searchParams.get('id');
    if (!imageId) {
      return NextResponse.json({ message: 'Image id is required' }, { status: 400 });
    }

    const image = await prisma.image.findUnique({ where: { id: Number(imageId) } });
    if (!image) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    if (image.photographerId !== photographer.id) {
      return NextResponse.json({ message: 'Not authorized to delete this image' }, { status: 403 });
    }

    // Delete from Cloudinary
    await deleteImageFromCloudinary(image.url);

    // Delete from database
    await prisma.image.delete({ where: { id: image.id } });

    return NextResponse.json({ message: 'Image deleted' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ message: 'Failed to delete image' }, { status: 500 });
  }
}
