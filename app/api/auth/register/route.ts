import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json(
    { message: "Registration is disabled. Please contact the administrator to add photographers." },
    { status: 403 }
  );
}
