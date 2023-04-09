export interface Plant {
    _id?: string;
    plantName: string;
    plantId: string;
    checked?: boolean;
    departments: any[]; // Define the departments property
}
