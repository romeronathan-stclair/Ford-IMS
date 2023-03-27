

export interface ForecastItem {
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
    modelType?: string;
}

export interface DepartmentForecast {
    departmentId: string;
    name: string;
    forecastedProducts: ProductForecast[];
}

export interface ProductForecast {
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
