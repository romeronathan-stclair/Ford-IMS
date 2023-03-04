import { Schema, Document, model } from "mongoose";


export type StockDocument = Document & {
    departmentId: string;
    name: string;
    partNumber: string;
    totalStockQty: number;
    stockQtyPerTote?: number;
    totesPerSkid?: number;
    currentCount: number;
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
    totalStockQty: {
        type: Number,
        required: true,
    },
    stockQtyPerTote: {
        type: Number,
        required: false,
    },
    totesPerSkid: {
        type: Number,
        required: false,
    },
    currentCount: {
        type: Number,
        required: true,
    },
    roughStock: {
        type: Boolean,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },
    lowStock: {
        type: Number,
        required: true,
    },
    moderateStock: {
        type: Number,
        required: true,
    },
    imageURL: {
        type: String,
        required: false,
    }
});


export const Stock = model<StockDocument>("Stock", stockSchema);
