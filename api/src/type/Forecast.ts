export type ForecastStockItem = {

    stockId: string;
    productId: string;
    name: string;
    partNumber: string;
    departmentId: string;
    totalStockPerSkid: number;
    currentCount: number;
    usePerProduct: number;
    totalPossibleBuilds: number;
    lowStockThreshold: boolean;
    moderateStockThreshold: boolean;
    belowDailyTarget: boolean;
    dailyTarget: number;
    jobsPerHour: number;
    shiftsBeforeShortage: number;
    hoursBeforeShortage: number;
    

}