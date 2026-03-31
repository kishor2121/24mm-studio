import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function GET(req: Request) {
  try {
    // Get active notifications (not expired)
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        photographer: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(notifications, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ message: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const photographerHeader = req.headers.get("x-photographer");
    
    if (!photographerHeader) {
      return NextResponse.json(
        { message: "Photographer ID required. Please login." },
        { status: 403 }
      );
    }

    let photographer;
    try {
      const photographerData = JSON.parse(photographerHeader);
      
      photographer = await prisma.photographer.findUnique({
        where: { id: photographerData.id },
      });

      if (!photographer) {
        return NextResponse.json(
          { message: "Photographer not found" },
          { status: 404 }
        );
      }
    } catch (parseError) {
      return NextResponse.json(
        { message: "Invalid photographer data" },
        { status: 400 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    let title, description, imageUrl, icon, expiresAt;

    // Handle FormData (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      title = formData.get("title") as string;
      description = formData.get("description") as string;
      icon = (formData.get("icon") as string) || "📢";
      expiresAt = (formData.get("expiresAt") as string) || null;
      
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json(
          { message: "Image file is required" },
          { status: 400 }
        );
      }

      try {
        // Upload to Cloudinary
        imageUrl = await uploadImageToCloudinary(file, "notifications", "image");
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return NextResponse.json(
          { message: "Failed to upload image: " + (uploadError instanceof Error ? uploadError.message : "Unknown error") },
          { status: 500 }
        );
      }
    } else {
      // Handle JSON
      const body = await req.json();
      title = body.title;
      description = body.description;
      imageUrl = body.imageUrl;
      icon = body.icon || "📢";
      expiresAt = body.expiresAt || null;
    }

    if (!title || !description || !imageUrl) {
      return NextResponse.json(
        { message: "Title, description, and image are required" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        description,
        imageUrl,
        icon: icon || "📢",
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        photographerId: photographer.id,
      },
      include: {
        photographer: {
          select: { name: true, email: true }
        }
      }
    });

    // Revalidate home page to show new notification
    revalidatePath("/");

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("Notification creation error:", error);
    return NextResponse.json(
      { message: "Failed to create notification", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const photographerHeader = req.headers.get("x-photographer");
    if (!photographerHeader) {
      return NextResponse.json({ message: "Photographer required" }, { status: 401 });
    }

    let photographer;
    try {
      const data = JSON.parse(photographerHeader);
      photographer = await prisma.photographer.findUnique({ where: { id: data.id } });
      if (!photographer) {
        return NextResponse.json({ message: "Photographer not found" }, { status: 404 });
      }
    } catch (err) {
      return NextResponse.json({ message: "Invalid photographer data" }, { status: 400 });
    }

    const url = new URL(req.url);
    const notificationId = url.searchParams.get("id");
    if (!notificationId) {
      return NextResponse.json({ message: "Notification id is required" }, { status: 400 });
    }

    const notification = await prisma.notification.findUnique({ where: { id: Number(notificationId) } });
    if (!notification) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }

    if (notification.photographerId !== photographer.id) {
      return NextResponse.json({ message: "Not authorized to delete this notification" }, { status: 403 });
    }

    await prisma.notification.delete({ where: { id: Number(notificationId) } });

    // Revalidate home page
    revalidatePath("/");

    return NextResponse.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json({ message: "Failed to delete notification" }, { status: 500 });
  }
}
