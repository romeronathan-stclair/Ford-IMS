import { Schema, Document, model } from "mongoose";


export type StockDocument = Document & {
    departmentId: string;
    name: string;
    partNumber: string;
    totalStockPerSkid: number;
    stockQtyPerTote?: number;
    totesPerSkid?: number;
    currentCount: number;
    roughStock: boolean;
    lowStock: number;
    moderateStock: number;
    marketLocation: string;
    imageURL: string;
    isSubAssembly: boolean;
    isDeleted: boolean;
    totalAvailableQty: number;
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
    totalStockPerSkid: {
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
    marketLocation: {
        type: String,
        required: true,
    },
    imageURL: {
        type: String,
        required: false,
    },
    isSubAssembly: {
        type: Boolean,
        required: true,
    },
    totalAvailableQty: {
        type: Number,
        required: true,
    }
});


export const Stock = model<StockDocument>("Stock", stockSchema);
