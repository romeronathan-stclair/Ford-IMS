import { json, NextFunction, Request, Response } from "express";
import { Department, DepartmentDocument, Event, User, UserDocument } from "../models";
import { Stock, StockDocument } from "../models/stock";
import { check } from "express-validator";
import { ModelType } from "../enums/modelType";
import { CrudType } from "../enums/crudType";
import { getPage, getPageSize } from "../utils/pagination";

//create Stock
export const createStock = async (req: Request, res: Response) => {
    //check if inputs are valid
    await check("departmentId", "departmentId is not valid").isLength({min: 1}).run(req);
    await check("name", "name is not valid").isLength({min: 1}).run(req);
    await check("partNumber", "partNumber is not valid").isLength({min: 1}).run(req);
    await check("stockPerTote", "stockPerTote is not valid").isLength({min: 1}).run(req);
    await check("toteQuantity", "toteQuantity is not valid").isLength({min: 1}).run(req);
    await check("skidQuantity", "skidQuantity is not valid").isLength({min: 1}).run(req);
    await check("lowStock", "lowStock is not valid").isLength({min: 1}).run(req);
    await check("imageURL", "imageURL is not valid").isLength({min: 1}).run(req);

    //check if Stock already exists
    let response;
    const stock: StockDocument = (await Stock.findOne({
        departmentId: req.body.departmentId,
        name: req.body.name,
        partNumber: req.body.partNumber,
        totalQuantity: req.body.totalQuantity,
        stockPerTote: req.body.stockPerTote,
        toteQuantity: req.body.toteQuantity,
        skidQuantity: req.body.skidQuantity,
        roughStock: req.body.roughStock,
        lowStock: req.body.lowStock,
        moderateStock: req.body.moderateStock,
        imageURL: req.body.imageURL,
        isDeleted: false
    })) as StockDocument;

    //request User
    const user: UserDocument = req.user as UserDocument;

    if (stock) {
        return res.status(500).json("Stock already exists");
    }

    //create new Stock
    const newStock: StockDocument = new Stock();
    newStock.departmentId = req.body.departmentId;
    newStock.name = req.body.name;
    newStock.partNumber = req.body.partNumber;
    newStock.totalQuantity = req.body.totalQuantity;
    newStock.stockPerTote = req.body.stockPerTote;
    newStock.toteQuantity = req.body.toteQuantity;
    newStock.skidQuantity = req.body.skidQuantity;
    newStock.roughStock = req.body.roughStock;
    newStock.lowStock = req.body.lowStock;
    newStock.moderateStock = req.body.moderateStock;
    newStock.imageURL = req.body.imageURL;
    newStock.isDeleted = false;

    //save new Stock
    response = {    
        stock: newStock,
        message: "Stock created successfully"
    }
    try {
        await newStock.save();
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json("Error creating Stock");
    }

};
