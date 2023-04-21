import { DunnageDocument, StockDocument } from "../models";

export type ProductionCountRequest =
    {
        departmentId: String;
        productList: ProductionCount[];
    }
    ;

type ProductionCount = {
    departmentId: String;
    productId: String;
    productQtyBuilt: Number;
}
