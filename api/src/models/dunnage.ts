

import { Schema, Document, model } from "mongoose";


export type DunnageDocument = Document & {
    departmentId: string;
    name: string;
    skidQuantity: number;
    currentCount?: number;
    lowStock: number;
    moderateStock: number;
    imageURL: string;
    isDeleted: boolean;
};

const dunnageSchema = new Schema<DunnageDocument>({
    departmentId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    skidQuantity: {
        type: Number,
        required: true,
    },
    currentCount: {
        type: Number,
        required: false,
    },
    lowStock: {
        type: Number,
        required: true,
    },
    moderateStock: {
        type: Number,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    }
});


export const Dunnage = model<DunnageDocument>("Dunnage", dunnageSchema);
