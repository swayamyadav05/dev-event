import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

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
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => {
          // Standard email validation regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: Verify that the referenced event exists
BookingSchema.pre('save', async function (next) {
  // Only validate eventId if it's new or modified
  if (this.isNew || this.isModified('eventId')) {
    try {
      const eventExists = await Event.findById(this.eventId);
      
      if (!eventExists) {
        return next(new Error('Event not found. Cannot create booking for non-existent event.'));
      }
      
      next();
    } catch (error) {
      return next(new Error('Error validating event reference'));
    }
  } else {
    next();
  }
});

// Create index on eventId for efficient queries
BookingSchema.index({ eventId: 1 });

// Export model (handles Next.js hot reloading)
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
