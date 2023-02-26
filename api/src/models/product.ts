
import { Schema, Document, model } from "mongoose";

export type ProductDocument = Document & {
    name: string;
    partNumber: string;
    departmentId: string; 
    dailyTarget: number;
    marketLocation: string;
    imageURL: string;
    isDeleted: boolean;

};

const productSchema = new Schema<ProductDocument>({
    name: {
        type: String,
        required: true,
    },
    partNumber: {
        type: String,
        required: true,
    },
    departmentId: {
        type: String,
        required: true,
    },
    dailyTarget: {  
        type: Number,
        required: true,
    },
    marketLocation: {
        type: String,
        required: true,
    },
    imageURL: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },

});


export const Product = model<ProductDocument>("Product", productSchema);
