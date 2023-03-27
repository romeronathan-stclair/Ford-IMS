import { Department, Dunnage, Plant, Product, ProductDocument, ProductDunnage, ProductDunnageDocument, Stock, StockDocument, UserDocument } from "../models";
import { ProductStock, ProductStockDocument } from "../models/productStock";
import { ForecastItem, ProductForecast } from "../type/Forecast";
import { NextFunction, Request, Response } from "express";
import { ModelType } from "../enums/modelType";
import util from "util";
import { redisClient } from "../app";
import * as forecastService from "../services/forecastService";
import { getPage, getPageSize } from "../utils/pagination";



export const getForecastProduct = async (req: Request, res: Response) => {

    const productId = req.params.id;

    const productForecast = await forecastService.forecastProduct(productId) as ProductForecast;

    return res.status(200).json(productForecast).end();
};



export const getPlantLowForecasts = async (req: Request, res: Response) => {

    const user = req.user as UserDocument;

    const activePlant = user.plants.find(plant => plant.isActive);

    if (!activePlant) {
        return res.status(400).send("No active plant found");
    }

    const departments = await Department.find({
        plantId: activePlant.plantId,
        isDeleted: false
    });

    const departmentIds = departments.map(department => department._id.toString());


    const promises = departmentIds.map(departmentId => forecastService.getDepartmentLowForecasts(departmentId));

    const results = await Promise.all(promises);

    let count = 0;
    results.forEach((result: any) => {
        count += result.productForecastItems.length
    });

    let response = {
        plantLowForecasts: results,
        lowProductsCount: count
    }

    return res.status(200).json(response);

}


export const departmentLowForecasts = async (req: Request, res: Response) => {
    if (!req.params.id) {
        return res.status(400).send("No department id provided");
    }
    const departmentId = req.params.id;

    const departmentLowForecasts = await forecastService.getDepartmentLowForecasts(departmentId);

    return res.status(200).send({ departmentLowForecasts });
}
export const getDepartmentForecasts = async (req: Request, res: Response) => {
    if (!req.params.id) {
        return res.status(400).send("No department id provided");
    }
    const departmentId = req.params.id;

    const departmentForecasts = await forecastService.forecastDepartment(departmentId);

    return res.status(200).send({ departmentForecasts });
}







export const getForecasts = async (req: Request, res: Response) => {
    const page = getPage(req);
    const pageSize = getPageSize(req);
    const departmentId = req.query.departmentId;
    const name = req.query.name ? decodeURIComponent(req.query.name.toString()) : undefined;
    const partNumber = req.query.partNumber;
    const plantId = req.query.plantId;


    if (departmentId) {

        const departmentForecasts = await forecastService.getDepartmentForecasts(departmentId.toString(), page, pageSize);
        return res.status(200).send(departmentForecasts);
    }
    if (plantId) {
        const plantForecasts = await forecastService.getPlantForecasts(plantId.toString(), page, pageSize);

        return res.status(200).send(plantForecasts);
    }



}
