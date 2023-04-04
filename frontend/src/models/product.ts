export interface Product {
    _id?: string;
    productId?: string;
    name: string;
    partNumber: string;
    departmentId: string;
    dailyTarget: number;
    marketLocation: string;
    imageURL: string;
    isDeleted: boolean;
    checked?: boolean;
    productQtyBuilt?: number;
    departmentName?: string;

}
