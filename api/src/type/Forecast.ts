import { ModelType } from "../enums/modelType";

export type ForecastItem = {
    stockId: string;
    productId: string;
    name: string;
    partNumber: string;
    departmentId: string;
    totalStockPerSkid?: number;
    usePerProduct?: number;
    totalAvailableQty?: number;
    totalPossibleBuilds: number;
    lowThreshold?: boolean;
    moderateThreshold?: boolean;
    belowDailyTarget?: boolean;
    dailyTarget?: number;
    jobsPerHour?: number;
    shiftsBeforeShortage?: number;
    hoursBeforeShortage?: number;
    fiveShiftsBeforeShortage?: boolean;
    modelType?: ModelType;
    imageURL?: string;
}
export type DepartmentForecast = {
    departmentId: string;
    name: string;
    forecastedProducts: ProductForecast[];
}

export type ProductForecast = {
    productId: string;
    name: string;
    departmentName: string;
    marketLocation: string;
    dailyTarget: number;
    stockForecast?: {
        forecastedStockItems: ForecastItem[];
        lowestStockItem: ForecastItem;
        lowStockCount: number;
        moderateStockCount: number;
        highStockCount: number;
    },
    dunnageForecast?: {
        forecastedDunnageItems: ForecastItem[];
        lowestDunnageItem: ForecastItem;
    }
}