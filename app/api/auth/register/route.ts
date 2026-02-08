import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, name, password, confirmPassword } = await req.json();

    if (!email || !name || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existingPhotographer = await prisma.photographer.findUnique({
      where: { email },
    });

    if (existingPhotographer) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const photographer = await prisma.photographer.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const { password: _, ...photographerData } = photographer;

    return NextResponse.json(
      {
        message: "Registration successful",
        photographer: photographerData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    );
  }
}
