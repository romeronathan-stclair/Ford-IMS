
import { Schema, Document, model } from "mongoose";


export type ProductStockDocument = Document & {
    productId: string;
    name: string;
    partNumber: string;
    stockId: string;
    departmentId: string;
    dailyTarget: number;
    usePerProduct: string;
    isDeleted: boolean;

};

const productStockSchema = new Schema<ProductStockDocument>({
    productId: {
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
    stockId: {
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
    usePerProduct: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },

});


export const ProductStock = model<ProductStockDocument>("ProductStock", productStockSchema);
