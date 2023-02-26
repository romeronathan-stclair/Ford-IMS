import { Schema, Document, model } from "mongoose";


export type DepartmentDocument = Document & {
    departmentName: string;
    plantId: string;
    isDeleted: boolean;
};

const departmentSchema = new Schema<DepartmentDocument>({
    departmentName: {
        type: String,
        required: true,
    },
    plantId: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },


});



export const Department = model<DepartmentDocument>("Department", departmentSchema);
