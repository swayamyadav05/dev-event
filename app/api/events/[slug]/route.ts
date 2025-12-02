import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Event } from "@/database";
import type { IEvent } from "@/database";

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Connect to database
    await connectDB();

    // Extract and validate slug parameter
    const { slug } = await params;

    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        {
          message: "Invalid or missing slug parameter",
        },
        { status: 400 }
      );
    }

    // Sanitize slug
    const sanitizedSlug = slug.trim().toLowerCase();

    // Query event by slug
    const event: IEvent | null = await Event.findOne({
      slug: sanitizedSlug,
    })
      .lean<IEvent>()
      .exec();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${sanitizedSlug}' not found` },
        { status: 404 }
      );
    }

    // Return successful response
    return NextResponse.json(
      {
        message: "Event fetched successfully",
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching event by slug:", error);
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        message: "Failed to fetch event",
        ...(process.env.NODE_ENV === "development" && {
          error:
            error instanceof Error ? error.message : "Unknown error",
        }),
      },
      { status: 500 }
    );
  }
}
