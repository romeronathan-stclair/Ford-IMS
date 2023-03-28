import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import passport, { use } from "passport";
import {
    User,
    UserDocument,
    Invite,
    PlantDocument,
    Plant,
    DepartmentDocument,
    Department,
    Event,
    EventDocument,
    Stock,
    StockDocument,
} from "../models";
import { ModelType } from "../enums/modelType";
import { CrudType } from "../enums/crudType";
import * as forecastService from "../services/forecastService";

import { ProductStock, ProductStockDocument } from "../models/productStock";

export const submitProductionCount = async (req: Request, res: Response) => {

    await check("productionCountRequest").isLength({ min: 1 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json(errors);
    }

    let departmentIds: string[] = [];



    let stockSaveList: StockDocument[] = [];

    const request = req.body.productionCountRequest;






    try {

        for (const department of request) {
            for (const product of department.productList) {




                const productQtyBuild = product.productQtyBuilt;
                const productId = product._id;




                const productStocks = (await ProductStock.find(
                    { productId: productId, isDeleted: false }
                )) as ProductStockDocument[];



                if (productStocks) {

                    for (const productStock of productStocks) {
                        const usePerBuild = Number(productStock.usePerProduct);
                        const stockUsed = productQtyBuild * usePerBuild;

                        const stock: StockDocument = (await Stock.findOne({
                            _id: productStock.stockId,
                            isDeleted: false
                        })) as StockDocument;
                        if (stock) {
                            stock.totalAvailableQty = stock.totalAvailableQty - stockUsed;
                        }

                        stockSaveList.push(stock);
                        await stock.save();
                    }


                } else {
                    return res.status(500).json(" No Product Stock Found.");
                }


            }
            await forecastService.forecastDepartment(department.departmentId).catch((e) => {
                return res.status(500).json("Forecast update failed for department: " + department.departmentName + ".");
            }
            );
        }
        try {
            if (stockSaveList.length > 0) {
                for (const stock of stockSaveList) {
                    await stock.save();
                }
            }

            const department = await Department.findById({
                _id: departmentIds[0],
                isDeleted: false,
            });
        
            if (!department) {
                return res.status(500).json("Department does not exist");
            }

            const plantId = department.plantId;

            const user = req.user as UserDocument;

            const event = new Event({
                plantId: plantId,
                departmentId: departmentIds[0],
                eventDate: new Date().toDateString(),
                userId: user._id.toString(),
                operationType: CrudType.CREATE,
                modelType: ModelType.SUBASSEMBLY,
                userName: user.name,
                userEmailAddress: user.email,
                itemId: '',
                itemName: 'Production Count',
            });
    
            event.save();

        } catch (e) {
            return res.status(500).json(e);

        } finally {
            return res.status(200).json("Submitted production count.");
        }
    } catch (e) {
        return res.status(500).json(e);
    }







}