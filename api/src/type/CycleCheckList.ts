import { DunnageDocument, StockDocument } from "../models";

export type CycleCheckList = 
    {
        departmentId: String;
        departmentName: String;
        stockList: StockDocument[];
        dunnage: DunnageDocument[];
    }
;