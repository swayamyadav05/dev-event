import { Schema, model, models, Document, Types } from "mongoose";

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => {
          // Standard email validation regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true,
  }
);

// NOTE: Event existence validation should be performed explicitly in the
// booking creation service/controller before calling booking.save().
// Example:
//   const event = await Event.findById(eventId);
//   if (!event) {
//     throw new Error('Event not found');
//   }
//   const booking = new Booking({ eventId, email });
//   await booking.save();

// Create index on eventId for efficient queries
BookingSchema.index({ eventId: 1 });

// Export model (handles Next.js hot reloading)
const Booking =
  models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
