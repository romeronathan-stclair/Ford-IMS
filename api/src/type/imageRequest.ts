import { ModelType } from "../enums/modelType";

export type ImageRequest = {
    image?: any;
    oldImage?: string;
    modelType: ModelType;
    plantId: string;
    departmentId: string;
    itemId: string;
};