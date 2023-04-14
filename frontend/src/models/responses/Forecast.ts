

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
    lowStockThreshold?: boolean;
    moderateStockThreshold?: boolean;
    belowDailyTarget?: boolean;
    dailyTarget?: number;
    jobsPerHour?: number;
    shiftsBeforeShortage?: number;
    hoursBeforeShortage?: number;
    fiveShiftsBeforeShortage?: boolean;
    modelType?: string;
    imageURL?: string;
}

export interface DepartmentForecast {
    departmentId: string;
    name: string;
    forecastedProducts: ProductForecast[];
}

export interface ProductForecast {
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
