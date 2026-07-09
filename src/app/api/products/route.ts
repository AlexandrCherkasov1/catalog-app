import { NextResponse } from "next/server";

const PRODUCTS_API_URL =
  "https://maxifoxy-testfront-96b4.twc1.net/api/products";

export async function GET() {
  try {
    const response = await fetch(PRODUCTS_API_URL, { cache: "no-store" });
    const data: unknown = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Products service is unavailable" },
      { status: 502 },
    );
  }
}