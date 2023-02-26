

import { Schema, Document, model } from "mongoose";


export type StockDocument = Document & {
    departmentId: string;
    name: string;
    partNumber: string;
    totalQuantity: string;
    stockPerTote: number;
    toteQuantity: number;
    skidQuantity?: number;
    roughStock: boolean;
    lowStock: number;
    moderateStock: number;
    imageURL: string;
    isDeleted: boolean;
};

const stockSchema = new Schema<StockDocument>({

    departmentId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    partNumber: {
        type: String,

        required: true,
    },
    totalQuantity: {
        type: String,
        required: true,
    },
    stockPerTote: {
        type: Number,
        required: true,
    },
    toteQuantity: {
        type: Number,
        required: true,
    },
    skidQuantity: {
        type: Number,
        required: false,
    },
    roughStock: {
        type: Boolean,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },
    


});


export const Stock = model<StockDocument>("Plant", stockSchema);
