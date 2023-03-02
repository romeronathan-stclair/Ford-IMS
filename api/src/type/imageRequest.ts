import { ModelType } from "../enums/modelType";

export type ImageRequest = {
    image?: any;
    modelType: ModelType;
    plantId: string;
    departmentId: string;
    itemId: string;
};