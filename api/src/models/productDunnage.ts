import { Schema, Document, model } from "mongoose";


export type DunnageDocument = Document & {
    productId: string;
    departmentId: string;
    name: string;
    skidQuantity: number;
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
    productId: {
        type: String,
        required: true,
    },
    skidQuantity: {
        type: Number,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },


});


export const ProductDunnage = model<DunnageDocument>("ProductDunnage", dunnageSchema);
