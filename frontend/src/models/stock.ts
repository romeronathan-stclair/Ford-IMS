export interface Stock {
  _id?: string;
  departmentId: string;
  name: string;
  partNumber: string;
  totalStockPerSkid: number;
  stockQtyPerTote?: number;
  totesPerSkid?: number;
  currentCount: number;
  roughStock: boolean;
  lowStock: number;
  moderateStock: number;
  marketLocation: string;
  imageURL: string;
  isSubAssembly: boolean;
  isDeleted: boolean;
  totalAvailableQty: number;
};
