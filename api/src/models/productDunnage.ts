import { Schema, Document, model } from "mongoose";


export type ProductDunnageDocument = Document & {
    productId: string;

    dunnageId: string;
    isDeleted: boolean;


};

const dunnageSchema = new Schema<ProductDunnageDocument>({
    productId: {
        type: String,
        required: true,
    },
    dunnageId: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },


});



export const ProductDunnage = model<ProductDunnageDocument>("ProductDunnage", dunnageSchema);
