import { NextResponse } from "next/server";
import { submitContactForm } from "@/actions/contact";
import { getClientIp } from "@/lib/rate-limiter";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const clientIp = getClientIp(request.headers);

    const result = await submitContactForm(body, clientIp);

    if (!result.success) {
      const isRateLimit =
        result.message.includes("Terlalu banyak permintaan") ||
        result.message.includes("rate limit");
      const status = isRateLimit ? 429 : 400;

      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/contact Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Format request tidak valid atau terjadi kesalahan server.",
      },
      { status: 500 }
    );
  }
}
