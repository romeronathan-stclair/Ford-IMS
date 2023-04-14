import { redisClient } from "../app";
import { ModelType } from "../enums/modelType";
import { Product, Department, Stock, ProductDunnage, ProductDunnageDocument, Dunnage, Plant } from "../models";
import { ProductStock, ProductStockDocument } from "../models/productStock";
import { ForecastItem, ProductForecast } from "../type/Forecast";
import util from "util";

export const forecastDepartment = async (departmentId: string) => {


    const products = await Product.find({
        departmentId: departmentId,
        isDeleted: false
    });
    const productIds = products.map(product => product._id.toString());

    const promises = productIds.map(productId => forecastProduct(productId));

    const results = await Promise.all(promises);

    let response = {
        departmentId: departmentId,
        forecastedProducts: results
    }
    return response;

}

export const getDepartmentForecasts = async (departmentId: string, page: number, pageSize: number) => {


    const department = await Department.findById(departmentId);

    const products = await Product.find({
        departmentId: departmentId,
        isDeleted: false
    }).skip(page * pageSize).limit(pageSize).exec();

    const forecastedProductsCount = await Product.find({
        departmentId: departmentId,
        isDeleted: false
    }).countDocuments().exec();

    const productIds = products.map(product => product._id.toString());


    const promises = productIds.map(productId => forecastProduct(productId));

    const results = await Promise.all(promises);

    let response = {
        forecastedProducts: results,
        forecastedProductsCount: forecastedProductsCount,
    }
    return response;

}
export const getPlantForecasts = async (plantId: string, page: number, pageSize: number) => {
    const departments = await Department.find({
        plantId: plantId,
        isDeleted: false
    });
    console.log("departments", departments.length);

    const departmentIds = departments.map(department => department._id.toString());

    const promises = departmentIds.map(departmentId => getDepartmentForecasts(departmentId, 0, 0));

    const results = await Promise.all(promises);

    const totalProductForecasts = results.reduce((accumulator, departmentForecast) => {
        return accumulator + departmentForecast.forecastedProductsCount;
    }, 0);

    console.log("totalProductForecasts", totalProductForecasts);

    const allForecastedProducts = results.flatMap(departmentForecast => departmentForecast.forecastedProducts);


    console.log("allForecastedProducts", allForecastedProducts.length);
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedForecastedProducts = allForecastedProducts.slice(startIndex, endIndex);


    console.log("paginatedForecastedProducts", paginatedForecastedProducts.length);

    let response = {
        forecastedProducts: paginatedForecastedProducts,
        forecastedProductsCount: totalProductForecasts
    }

    return response;
}

export const forecastPlant = async (plantId: string) => {


    const departments = await Department.find({
        plantId: plantId,
        isDeleted: false
    });

    const departmentIds = departments.map(department => department._id.toString());

    const promises = departmentIds.map(departmentId => forecastDepartment(departmentId));

    const results = await Promise.all(promises);

    let response = {
        plantId: plantId,
        departmentForecasts: results
    }


    return response;

}

export const forecastProduct = async (productId: string) => {



    const product = await Product.findOne({
        _id: productId,
        isDeleted: false
    });

    const department = await Department.findOne({
        _id: product?.departmentId,
        isDeleted: false
    });



    if (!product || !department) {
        return null;
    }

    let productForecast: ProductForecast = {
        productId: productId,
        marketLocation: product.marketLocation,
        dailyTarget: product.dailyTarget,
        name: product.name,
        departmentName: department.departmentName
    }



    await stockForecast(productId).then((result) => {
        productForecast.stockForecast = result as {
            forecastedStockItems: ForecastItem[];
            lowestStockItem: ForecastItem;
            lowStockCount: number;
            moderateStockCount: number;
            highStockCount: number;
        };
    }).catch((err: any) => {

        productForecast.stockForecast = err;
    });

    await dunnageForecast(productId).then((result) => {
        productForecast.dunnageForecast = result as {
            forecastedDunnageItems: ForecastItem[];
            lowestDunnageItem: ForecastItem;
            lowDunnageCount: number;
        };
    }).catch((err: any) => {

        productForecast.dunnageForecast = err;
    }
    );

    let forecastItems: ForecastItem[] = [];
    if (productForecast.stockForecast && productForecast.stockForecast.forecastedStockItems && productForecast.stockForecast.forecastedStockItems.length > 0) {
        forecastItems = forecastItems.concat(productForecast.stockForecast.forecastedStockItems);
    }
    if (productForecast.dunnageForecast && productForecast.dunnageForecast.forecastedDunnageItems && productForecast.dunnageForecast.forecastedDunnageItems.length > 0) {
        forecastItems = forecastItems.concat(productForecast.dunnageForecast.forecastedDunnageItems);
    }

    if (forecastItems.length === 0) {
        await redisClient.set(productId, "false");
    }

    await lowProductEntry(forecastItems);



    return productForecast;
}
export const stockForecast = async (
    productId: string
) => {
    return new Promise(async (resolve, reject) => {

        let lowStockCount = 0
        let moderateStockCount = 0
        let highStockCount = 0


        const product = await Product.findOne({
            _id: productId,
            isDeleted: false
        });

        if (!product) {
            return null;
        }

        const productStocks = await ProductStock.find({
            productId: productId,
            isDeleted: false
        });

        console.log("productStocks", productStocks.length);


        if (productStocks.length > 0) {

            let lowestStockItem = { totalPossibleBuilds: Number.MAX_SAFE_INTEGER } as ForecastItem;

            const dailyTarget = product.dailyTarget;

            const forecastStockItems: ForecastItem[] = [];

            const promises = productStocks.map(async (productStock: ProductStockDocument) => {

                const stock = await Stock.findOne({
                    _id: productStock.stockId,
                    isDeleted: false
                });

                if (!stock) {
                    return reject("Stock not found");
                }

                const usePerProduct = productStock.usePerProduct;

                const totalAvailableQty = stock.totalAvailableQty;
                const totalStockPerSkid = stock.totalStockPerSkid;

                const lowStockThreshold = stock.currentCount <= stock.lowStock;
                const moderateStockThreshold = stock.currentCount <= stock.moderateStock;


                const totalPossibleBuilds = Math.floor(totalAvailableQty / usePerProduct);
                const belowDailyTarget = totalPossibleBuilds <= dailyTarget;
                const jobsPerHour = dailyTarget / 24;
                const shiftsBeforeShortage = Math.floor(totalPossibleBuilds / (dailyTarget / 3));
                const hoursBeforeShortage = Math.floor(totalPossibleBuilds / jobsPerHour);
                if (lowStockThreshold || belowDailyTarget || shiftsBeforeShortage < 3) {
                    lowStockCount++;
                } else if (moderateStockThreshold) {
                    moderateStockCount++;
                } else {
                    highStockCount++;
                }

                const forecastStockItem = {
                    stockId: stock._id.toString(),
                    productId: product._id.toString(),
                    fiveShiftsBeforeShortage: shiftsBeforeShortage < 3,
                    name: stock.name,
                    partNumber: stock.partNumber,
                    departmentId: stock.departmentId,
                    totalStockPerSkid: totalStockPerSkid,
                    usePerProduct: usePerProduct,
                    totalAvailableQty: totalAvailableQty,
                    totalPossibleBuilds: totalPossibleBuilds,
                    lowStockThreshold: lowStockThreshold,
                    moderateStockThreshold: moderateStockThreshold,
                    belowDailyTarget: belowDailyTarget,
                    dailyTarget: dailyTarget,
                    jobsPerHour: jobsPerHour,
                    shiftsBeforeShortage: shiftsBeforeShortage,
                    hoursBeforeShortage: hoursBeforeShortage,
                    imageURL: stock.imageURL,
                    modelType: ModelType.STOCK
                } as ForecastItem;






                if (totalPossibleBuilds < lowestStockItem.totalPossibleBuilds) {
                    lowestStockItem = forecastStockItem;
                }

                forecastStockItems.push(forecastStockItem);

                return forecastStockItem;

            }
            );




            // Wait for all the promises to resolve before returning the result
            const results: any = await Promise.all(promises);

            // Remove null items from the array
            const filteredResults = results.filter((item: null) => item !== null);



            let response = {
                forecastedStockItems: filteredResults,
                lowestStockItem: lowestStockItem,
                lowStockCount: lowStockCount,
                moderateStockCount: moderateStockCount,
                highStockCount: highStockCount
            }




            return resolve(response);
        } else {
            return reject("No product stocks found");
        }
    }
    );
};
export const dunnageForecast = async (
    productId: string
) => {

    return new Promise(async (resolve, reject) => {

        let lowDunnageCount = 0;

        const product = await Product.findOne({
            _id: productId,
            isDeleted: false
        });

        if (!product) {
            return reject("Product not found");
        }

        const productDunnage = await ProductDunnage.find({
            productId: productId,
            isDeleted: false
        });



        if (productDunnage.length > 0) {
            let lowestDunnageItem = { totalPossibleBuilds: Number.MAX_SAFE_INTEGER } as ForecastItem;

            const dailyTarget = product.dailyTarget;

            const forecastStockItems: ForecastItem[] = [];

            const promises = productDunnage.map(async (productDunnage: ProductDunnageDocument) => {

                const dunnage = await Dunnage.findOne({
                    _id: productDunnage.dunnageId,
                    isDeleted: false
                });

                if (!dunnage) {
                    return null;
                }



                const skidQuantity = dunnage.skidQuantity;
                const currentCount = dunnage.currentCount || 0;

                const availableSkids = Math.floor(currentCount * skidQuantity);

                const lowStockThreshold = dunnage.currentCount && dunnage.currentCount <= dunnage.lowStock;
                const moderateStockThreshold = dunnage.currentCount && dunnage.currentCount <= dunnage.moderateStock;


                const totalPossibleBuilds = Math.floor(availableSkids);
                const belowDailyTarget = totalPossibleBuilds <= dailyTarget;
                const jobsPerHour = dailyTarget / 24;
                const shiftsBeforeShortage = Math.floor(totalPossibleBuilds / (dailyTarget / 3));
                const hoursBeforeShortage = Math.floor(totalPossibleBuilds / jobsPerHour);
                if (lowStockThreshold || belowDailyTarget || shiftsBeforeShortage < 5) {
                    lowDunnageCount++;
                }
                const forecastDunnageItem = {
                    stockId: dunnage._id.toString(),
                    productId: product._id.toString(),
                    name: dunnage.name,
                    departmentId: dunnage.departmentId,
                    totalAvailableQty: availableSkids,
                    fiveShiftsBeforeShortage: shiftsBeforeShortage < 3,
                    totalPossibleBuilds: totalPossibleBuilds,
                    lowThreshold: lowStockThreshold,
                    moderateThreshold: moderateStockThreshold,
                    belowDailyTarget: belowDailyTarget,
                    dailyTarget: dailyTarget,
                    jobsPerHour: jobsPerHour,
                    shiftsBeforeShortage: shiftsBeforeShortage,
                    hoursBeforeShortage: hoursBeforeShortage,
                    modelType: ModelType.DUNNAGE
                } as ForecastItem;



                if (forecastDunnageItem.totalPossibleBuilds && forecastDunnageItem.totalPossibleBuilds < lowestDunnageItem.totalPossibleBuilds) {
                    lowestDunnageItem = forecastDunnageItem;
                }

                forecastStockItems.push(forecastDunnageItem);

                return forecastDunnageItem;

            }
            );

            // Wait for all the promises to resolve before returning the result
            const results = await Promise.all(promises);

            // Remove null items from the array
            const filteredResults = results.filter(item => item !== null);

            let response = {
                lowestDunnageItem: lowestDunnageItem,
                forecastDunnageItems: filteredResults,
                lowDunnageCount: lowDunnageCount
            }

            return resolve(response);
        } else {
            return reject("No product dunnage found");
        }
    });
};
export const lowProductEntry = async (forecastItems: ForecastItem[]) => {



    for (const item of forecastItems) {

        if (item.fiveShiftsBeforeShortage || item.lowThreshold ||
            item.belowDailyTarget) {
            console.log("TRUE");
            await redisClient.set(item.productId, "true");
        } else {
            console.log("FALSE");
            await redisClient.set(item.productId, "false");
        }

    }

};

export const getDepartmentLowForecasts = async (departmentId: string) => {
    const getAsync = util.promisify(redisClient.get).bind(redisClient);

    return new Promise(async (resolve, reject) => {

        if (!departmentId) {
            return reject("Department Id is required");
        }

        const department = await Department.findOne({
            _id: departmentId,
            isDeleted: false
        });

        if (!department) {
            return reject("Department not found");
        }

        let productForecastItems: ForecastItem[] = [];


        const products = await Product.find({
            departmentId: departmentId,
            isDeleted: false
        });
        const productIds = products.map(product => product._id.toString());


        for (const productId of productIds) {
            await getAsync(productId).then(async (result: any) => {
                if (result === "true") {
                    await forecastProduct(productId).then(async (forecastItem: any) => {
                        if (forecastItem) {

                            productForecastItems.push(forecastItem);
                        }
                    }).catch((err: any) => {

                    }
                    );
                }
            }).catch((err: any) => {

            }
            );

        }

        let response = {
            departmentId: departmentId,
            departmentName: department.departmentName,
            productForecastItems: productForecastItems
        }


        return resolve(response);




    })
};
