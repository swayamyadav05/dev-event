"use server";

import { Event, IEvent } from "@/database";
import connectDB from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();

    const event = await Event.findOne({ slug });
    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    })
      .lean<IEvent>()
      .exec();

    return similarEvents;
  } catch {
    return [];
  }
};
