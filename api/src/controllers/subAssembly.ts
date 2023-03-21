import { json, NextFunction, Request, Response } from "express";
import { Department, DepartmentDocument, UserDocument } from "../models";
import { Stock, StockDocument } from "../models/stock";
import { check, validationResult } from "express-validator";
import { SubAssemblyList } from "../type/SubAssemblyList";
import { ForecastItem } from "../type/Forecast";
import * as forecastService from "../services/forecastService";

export const getSubAssembly = async (req: Request, res: Response) => {
    const user = req.user as UserDocument;
    let subAssemblyList: SubAssemblyList[] = [];

    const plant = user.plants.find((plant) => {
        if (plant.isActive) {
            return plant
        }
    });

    if (!plant) {
        return res.status(500).json("No active plants");
    }

    const departmentIds = plant.departments.map((department) => {
        return department;
    });

    for (const departmentId of departmentIds) {
        const department: DepartmentDocument = (await Department.findOne({
            _id: departmentId,
            isDeleted: false
        })) as DepartmentDocument;

        if (!department) {
            return res.status(500).json("Department does not exist");
        }

        let stockList: StockDocument[] = (await Stock.find({
            departmentId: departmentId,
            isSubAssembly: true,
            isDeleted: false
        })) as StockDocument[];

        subAssemblyList.push({
            departmentId: departmentId,
            departmentName: department.departmentName,
            stockList: stockList
        });

    }

    return res.status(200).json(subAssemblyList).end();

};

export const submitSubAssembly = async (req: Request, res: Response) => {
    await check("subAssemblyList", "Sub Assembly List is not valid").isLength({ min: 1 }).run(req);

    const user = req.user as UserDocument;

    const plant = user.plants.find((plant) => {
        if (plant.isActive) {
            return plant
        }
    });
    if (!plant) {
        return res.status(500).json("No active plants");
    }

    const errors = validationResult(req);

    const stockSaveList = [];

    if (!errors.isEmpty()) {
        return res.status(500).json(errors);
    }

    const subAssemblyList = req.body.subAssemblyList;

    try {
        for (const subAssembly of subAssemblyList) {

            const departmentId = subAssembly.departmentId;

            const department = await Department.findOne({
                _id: departmentId,
                isDeleted: false
            });

            if (!department) {
                return res.status(500).json("Department does not exist");
            }

            if (subAssembly.stockList) {
                const departmentStocks = await Stock.find({
                    departmentId: departmentId,
                    isSubAssembly: true,
                    isDeleted: false
                });

                const stockList = subAssembly.stockList;

                for (const stock of stockList) {

                    const matchedStock = departmentStocks.find((s: any) => {
                        return s._id.toString() === stock._id.toString();
                    });
                    if (!matchedStock) {
                        return res.status(500).json("Stock does not exist");
                    }
                    matchedStock.currentCount = stock.currentCount;

                    matchedStock.totalAvailableQty = stock.currentCount * matchedStock.totalStockPerSkid;

                    stockSaveList.push(matchedStock);
                    console.log(matchedStock);


                }
            }
        }
    } catch (err) {
        return res.status(500).json(err);
    }

    try {
        if (stockSaveList.length > 0) {
            for (const stock of stockSaveList) {
                await stock.save();
            }
        }
    } catch (err) {
        return res.status(500).json(err);
    } finally {
        const forecast = await forecastService.forecastPlant(plant.plantId);
        return res.status(200).json("Sub Assembly List Submitted");
    }
    
};