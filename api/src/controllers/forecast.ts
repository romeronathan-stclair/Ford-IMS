import { Dunnage, Product, ProductDocument, ProductDunnage, ProductDunnageDocument, Stock, StockDocument } from "../models";
import { ProductStock, ProductStockDocument } from "../models/productStock";
import { ForecastItem, ProductForecast } from "../type/Forecast";
import { NextFunction, Request, Response } from "express";
import { ModelType } from "../enums/modelType";


export const productForecast = async (req: Request, res: Response) => {

    const productId = req.params.id;


    const product = await Product.findOne({
        _id: productId,
        isDeleted: false
    });

    if (!product) {
        return null;
    }

    let productForecast: ProductForecast = {
        productId: productId,
        name: product.name

    }



    await stockForecast(productId).then((result) => {
        productForecast.stockForecast = result as {
            forecastedStockItems: ForecastItem[];
            lowestStockItem: ForecastItem;
        };
    }).catch((err: any) => {
        console.log(err);
        return null;
    });

    await dunnageForecast(productId).then((result) => {
        productForecast.dunnageForecast = result as {
            forecastedDunnageItems: ForecastItem[];
            lowestDunnageItem: ForecastItem;
        };
    }).catch((err: any) => {
        console.log(err);
        return null;
    }
    );





    return res.status(200).json(productForecast);




};


const stockForecast = async (
    productId: string
) => {
    return new Promise(async (resolve, reject) => {


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

                const forecastStockItem = {
                    stockId: stock._id.toString(),
                    productId: product._id.toString(),
                    fiveShiftsBeforeShortage: shiftsBeforeShortage < 5,
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
                lowestStockItem: lowestStockItem
            }

            console.log(response);



            return resolve(response);
        } else {
            return reject("No product stocks found");
        }
    }
    );
};


const dunnageForecast = async (
    productId: string
) => {

    return new Promise(async (resolve, reject) => {



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

                const forecastDunnageItem = {
                    stockId: dunnage._id.toString(),
                    productId: product._id.toString(),
                    name: dunnage.name,
                    departmentId: dunnage.departmentId,
                    totalAvailableQty: availableSkids,
                    fiveShiftsBeforeShortage: shiftsBeforeShortage < 5,
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
                forecastDunnageItems: filteredResults
            }

            return resolve(response);
        } else {
            return reject("No product dunnage found");
        }
    });
};