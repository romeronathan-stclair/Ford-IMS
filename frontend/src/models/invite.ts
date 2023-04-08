import { Department } from "./department";

export interface Invite {
    token?: string;
    email?: string;
    adminType?: string;
    plants?: [{
        plantId: string;
        plantName: string;
        departments: Department[];
    }];
}