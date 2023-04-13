export interface Dunnage {
  _id?: string;
  departmentId: string;
  name: string;
  skidQuantity: number;
  currentCount: number;
  lowStock: number;
  moderateStock: number;
  marketLocation: string;
  imageURL: string;
  isDeleted: boolean;
};
