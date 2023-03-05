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
}
export type DepartmentForecast = {
    departmentId: string;
    name: string;
    forecastedProducts: ProductForecast[];
}

export type ProductForecast = {
    productId: string;
    name: string;
    stockForecast?: {
        forecastedStockItems: ForecastItem[];
        lowestStockItem: ForecastItem;
    },
    dunnageForecast?: {
        forecastedDunnageItems: ForecastItem[];
        lowestDunnageItem: ForecastItem;
    }
}