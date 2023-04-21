import { Schema, Document, model } from "mongoose";


export type PlantDocument = Document & {
    plantName: string;
    plantLocation: string;
    isDeleted: boolean;

};

const PlantSchema = new Schema<PlantDocument>({
    plantName: {
        type: String,
        required: true,
    },
    plantLocation: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },


});


export const Plant = model<PlantDocument>("Plant", PlantSchema);
