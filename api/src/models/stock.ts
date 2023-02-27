import { Schema, Document, model } from "mongoose";


export type StockDocument = Document & {
    departmentId: string;
    name: string;
    partNumber: string;
    totalQuantity: number;
    stockPerTote: number;
    toteQuantity: number;
    currentCount?: number;
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
        type: Number,
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
    currentCount: {
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


export const Stock = model<StockDocument>("Stock", stockSchema);
