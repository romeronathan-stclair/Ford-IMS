import { Product } from "../product";


export interface DepartmentCount {
    departmentId: string;
    departmentName: string;
    productList: Product[];
}

export interface ProductionCountRequest {
    productionCountRequest: DepartmentCount[];
}