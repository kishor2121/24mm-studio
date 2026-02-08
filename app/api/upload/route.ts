import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Get photographer from request headers or body
    // Since we're using localStorage, photographer data should be sent in headers
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
      
      // Verify photographer exists in database
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

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as string) || "image";

    if (!file) {
      return NextResponse.json(
        { message: "File is required" },
        { status: 400 }
      );
    }

    if (!["image", "video"].includes(type)) {
      return NextResponse.json(
        { message: "Invalid media type. Must be 'image' or 'video'" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const url = await uploadImageToCloudinary(
      file,
      `studio-24mm/${type}s`,
      type === "video" ? "video" : "auto"
    );

    // Create record in database
    if (type === "image") {
      const newImage = await prisma.image.create({
        data: {
          url,
          photographerId: photographer.id,
        },
      });
      return NextResponse.json(newImage, { status: 201 });
    } else {
      const newVideo = await prisma.video.create({
        data: {
          url,
          photographerId: photographer.id,
        },
      });
      return NextResponse.json(newVideo, { status: 201 });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Upload failed", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
