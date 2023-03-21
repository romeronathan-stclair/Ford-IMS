import { StockDocument } from "../models";

export type SubAssemblyList = 
    {
        departmentId: String;
        departmentName: String;
        stockList: StockDocument[];
    }