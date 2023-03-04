import { Product, ProductDocument, ProductDunnage, Stock, StockDocument } from "../models";
import { ProductStock, ProductStockDocument } from "../models/productStock";
import { ForecastStockItem } from "../type/Forecast";
import { NextFunction, Request, Response } from "express";


export const productForecast = async (req: Request, res: Response) => {

    if (!req.params.id) {
        return res.status(500).json("Product Id is required");
    }
    const productId = req.params.id;



    const product = await Product.findOne({
        _id: productId,
        isDeleted: false
    });

    if (!product) {
        return null;
    }

    const productStock = await ProductStock.find({
        productId: productId,
        isDeleted: false
    });



    await stockForecast(productStock, product).then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        return res.status(500).json(err);
    });





};

const stockForecast = async (
    productStocks: ProductStockDocument[],
    product: ProductDocument
) => {



    const dailyTarget = product.dailyTarget;

    const forecastStockItems: ForecastStockItem[] = [];

    const promises = productStocks.map(async (productStock: ProductStockDocument) => {

        const stock = await Stock.findOne({
            _id: productStock.stockId,
            isDeleted: false
        });



        if (!stock) {
            return null;
        }


        const usePerProduct = productStock.usePerProduct;


        const currentCount = stock.currentCount;
        const totalStockPerSkid = stock.totalStockQty;


        const lowStockThreshold = stock.currentCount <= stock.lowStock;
        const moderateStockThreshold = stock.currentCount <= stock.moderateStock;


        const totalAmountOnHand = currentCount * totalStockPerSkid;
        const totalPossibleBuilds = Math.floor(totalAmountOnHand / usePerProduct);
        const belowDailyTarget = totalPossibleBuilds <= dailyTarget;
        const jobsPerHour = dailyTarget / 24;
        const shiftsBeforeShortage = Math.floor(totalPossibleBuilds / (dailyTarget / 3));
        const hoursBeforeShortage = Math.floor(totalPossibleBuilds / jobsPerHour);

        const forecastStockItem = {
            stockId: stock._id.toString(),
            productId: product._id.toString(),
            name: stock.name,
            partNumber: stock.partNumber,
            departmentId: stock.departmentId,
            totalStockPerSkid: totalStockPerSkid,
            currentCount: currentCount,
            usePerProduct: usePerProduct,
            totalPossibleBuilds: totalPossibleBuilds,
            lowStockThreshold: lowStockThreshold,
            moderateStockThreshold: moderateStockThreshold,
            belowDailyTarget: belowDailyTarget,
            dailyTarget: dailyTarget,
            jobsPerHour: jobsPerHour,
            shiftsBeforeShortage: shiftsBeforeShortage,
            hoursBeforeShortage: hoursBeforeShortage

        } as ForecastStockItem;
        forecastStockItems.push(forecastStockItem);
        console.log(forecastStockItem);
        return forecastStockItem;

    }
    );

    // Wait for all the promises to resolve before returning the result
    const results = await Promise.all(promises);

    // Remove null items from the array
    const filteredResults = results.filter(item => item !== null);

    return filteredResults;
};

