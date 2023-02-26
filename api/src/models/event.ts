import { Schema, Document, model } from "mongoose";

export type EventDocument = Document & {
  plantId: string;
  departmentId: string;
  eventDate: string;
  userId: string;
  operationType: string;
  itemType: string;
  userName: string;
  userEmailAddress: string;
  itemId: string;
};

const EventSchema = new Schema<EventDocument>(
  {
    plantId: {
      type: String,
      required: true,
    },
    departmentId: {
      type: String,
      required: true,
    },
    eventDate: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    operationType: {
      type: String,
      required: true,
    },
    itemType: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmailAddress: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Event = model<EventDocument>("Event", EventSchema);
