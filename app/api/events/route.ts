import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Event } from "@/database";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const event = Object.fromEntries(formData.entries());

    // Normalize slug if provided (to match GET lookup normalization)
    if (event.slug && typeof event.slug === "string") {
      event.slug = event.slug.trim().toLowerCase();
    }

    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );
    }

    const tags = JSON.parse(formData.get("tags") as string);
    const agenda = JSON.parse(formData.get("agenda") as string);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, result) => {
            if (error) return reject(error);

            resolve(result);
          }
        )
        .end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;

    try {
      const createdEvent = await Event.create({
        ...event,
        tags: tags,
        agenda: agenda,
      });
      return NextResponse.json(
        {
          message: "Event created successfully",
          event: createdEvent,
        },
        { status: 201 }
      );
    } catch (dbError) {
      const publicId = (
        uploadResult as { public_id?: string } | undefined
      )?.public_id;
      if (publicId) {
        await cloudinary.uploader
          .destroy(publicId, { resource_type: "image" })
          .catch(() => {});
      }
      throw dbError;
    }
  } catch (e) {
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Event fetched successfully", events },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Event fetching failed",
        error: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// a route that accepts a slug as input -> returns the event details
