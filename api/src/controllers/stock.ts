import { json, NextFunction, Request, Response } from "express";
import { Department, DepartmentDocument, UserDocument } from "../models";
import { Stock, StockDocument } from "../models/stock";
import { check } from "express-validator";
import { ModelType } from "../enums/modelType";
import { CrudType } from "../enums/crudType";
import { getPage, getPageSize } from "../utils/pagination";
import { ImageRequest } from "../type/imageRequest";
import { uploadImage } from "./image";
import { Types } from "mongoose";
import env from "../utils/env";

//create Stock
export const createStock = async (req: Request, res: Response) => {
    //check if inputs are valid
    await check("departmentId", "departmentId is not valid").isLength({ min: 1 }).run(req);
    await check("name", "name is not valid").isLength({ min: 1 }).run(req);
    await check("partNumber", "partNumber is not valid").isLength({ min: 1 }).run(req);
    await check("stockPerTote", "stockPerTote is not valid").isLength({ min: 1 }).run(req);
    await check("toteQuantity", "toteQuantity is not valid").isLength({ min: 1 }).run(req);
    await check("lowStock", "lowStock is not valid").isLength({ min: 1 }).run(req);
    await check("moderateStock", "moderateStock is not valid").isLength({ min: 1 }).run(req);
    await check("roughStock", "roughStock is not valid").isLength({ min: 1 }).run(req);
    await check("totalQuantity", "totalQuantity is not valid").isLength({ min: 1 }).run(req);


    const departmentId = req.body.departmentId;

    console.log(departmentId);

    const department = await Department.findById({
        _id: departmentId,
        isDeleted: false,
    });

    if (!department) {
        return res.status(500).json("Department does not exist");
    }
    const plantId = department.plantId;

    const user = req.user as UserDocument;

    const existingStock: StockDocument = (await Stock.findOne({
        departmentId: req.body.departmentId.toString(),
        name: req.body.name,
    })) as StockDocument;

    if (existingStock) {
        return res.status(500).json("Stock already exists");
    }

    const stock: StockDocument = new Stock({
        departmentId: req.body.departmentId.toString(),
        name: req.body.name,
        partNumber: req.body.partNumber,
        totalQuantity: req.body.totalQuantity,
        stockPerTote: req.body.stockPerTote,
        toteQuantity: req.body.toteQuantity,
        currentCount: 0,
        roughStock: req.body.roughStock,
        lowStock: req.body.lowStock,
        moderateStock: req.body.moderateStock,
        isDeleted: false,

    });

    try {
        await stock.save();
    } catch (err) {
        return res.status(500).json("Error creating Stock: " + err);
    }


    if (req.files) {
        const image = req.files.file;

        const imageRequest: ImageRequest = {
            itemId: stock._id.toString(),
            plantId: plantId,
            departmentId: stock.departmentId,
            modelType: ModelType.STOCK,
            image: image,

        };

        await uploadImage(imageRequest)
            .then((result: any) => {
                stock.imageURL = env.app.apiUrl + "/" + result;
                try {
                    stock.save();
                }
                catch (err) {
                    stock.remove();
                    return res.status(500).json("Error creating Stock");
                }

            })
            .catch((err: any) => {
                console.log(err);

                try {
                    stock.remove();
                }
                catch (err) {
                    console.log(err);
                }
                return res.status(500).json("Error creating Stock");
            });
    }
    return res.status(200).json(stock);
};

//get Stock by Id
export const getStockById = async (req: Request, res: Response) => {
    await check("id", "id is not valid").isLength({ min: 1 }).run(req);

    //find Stock by Id
    const stock: StockDocument = (await Stock.findOne({
        _id: req.body.id,
        isDeleted: false
    })) as StockDocument;

    if (!stock) {
        return res.status(500).json("Stock not found");
    }

    //return Stock
    return res.status(200).json(stock);
};

//get all Stocks
export const getAllStocks = async (req: Request, res: Response) => {
    const page = getPage(req);
    const pageSize = getPageSize(req);

    const stocks = await Stock.find({ isDeleted: false }).skip(page * pageSize).limit(pageSize).exec();

    if (!stocks) {
        return res.status(500).json("Stocks not found");
    }

    return res.status(200).json(stocks);

};

//get Stock by Departments Id
export const getStockByDepartmentId = async (req: Request, res: Response) => {
    await check("departmentId", "departmentId is not valid").isLength({ min: 1 }).run(req);

    //find Stock by Department Id
    const stocks: StockDocument[] = (await Stock.find({
        departmentId: req.body.departmentId,
        isDeleted: false
    })) as StockDocument[];

    if (!stocks) {
        return res.status(500).json("Stocks not found");
    }

    //return Stock
    return res.status(200).json(stocks);
};

//get Stock by Name
export const getStockByName = async (req: Request, res: Response) => {
    await check("name", "name is not valid").isLength({ min: 1 }).run(req);

    //find Stock by Name
    const stocks: StockDocument[] = (await Stock.find({
        name: req.body.name,
        isDeleted: false
    })) as StockDocument[];

    if (!stocks) {
        return res.status(500).json("Stocks not found");
    }

    //return Stock
    return res.status(200).json(stocks);
}

//get Stock by Part Number
export const getStockByPartNumber = async (req: Request, res: Response) => {
    await check("partNumber", "partNumber is not valid").isLength({ min: 1 }).run(req);

    //find Stock by Part Number
    const stocks: StockDocument[] = (await Stock.find({
        partNumber: req.body.partNumber,
        isDeleted: false
    })) as StockDocument[];

    if (!stocks) {
        return res.status(500).json("Stocks not found");
    }

    //return Stock
    return res.status(200).json(stocks);
};

//update Stock
export const updateStock = async (req: Request, res: Response) => {
    await check("id", "id is not valid").isLength({ min: 1 }).run(req);
    await check("departmentId", "departmentId is not valid").isLength({ min: 1 }).run(req);
    await check("name", "name is not valid").isLength({ min: 1 }).run(req);
    await check("partNumber", "partNumber is not valid").isLength({ min: 1 }).run(req);
    await check("stockPerTote", "stockPerTote is not valid").isLength({ min: 1 }).run(req);
    await check("toteQuantity", "toteQuantity is not valid").isLength({ min: 1 }).run(req);
    await check("skidQuantity", "skidQuantity is not valid").isLength({ min: 1 }).run(req);
    await check("lowStock", "lowStock is not valid").isLength({ min: 1 }).run(req);
    await check("imageURL", "imageURL is not valid").isLength({ min: 1 }).run(req);

    //find Stock by Id
    const stock: StockDocument = (await Stock.findOne({
        _id: req.body.id,
        isDeleted: false
    })) as StockDocument;

    if (!stock) {
        return res.status(500).json("Stock not found");
    }

    //update Stock
    stock.departmentId = req.body.departmentId;
    stock.name = req.body.name;
    stock.partNumber = req.body.partNumber;
    stock.totalQuantity = req.body.totalQuantity;
    stock.stockPerTote = req.body.stockPerTote;
    stock.toteQuantity = req.body.toteQuantity;
    stock.currentCount = req.body.currentCount;
    stock.roughStock = req.body.roughStock;
    stock.lowStock = req.body.lowStock;
    stock.moderateStock = req.body.moderateStock;
    stock.imageURL = req.body.imageURL;
    stock.isDeleted = false;

    //save Updated Stock
    try {
        await stock.save();
        return res.status(200).json("Stock updated successfully");
    }
    catch (err) {
        return res.status(500).json("Error updating Stock");
    }
};

//delete Stock
export const deleteStock = async (req: Request, res: Response) => {
    await check("id", "id is not valid").isLength({ min: 1 }).run(req);

    //find Stock by Id
    const stock: StockDocument = (await Stock.findOne({
        _id: req.body.id,
        isDeleted: false
    })) as StockDocument;

    if (!stock) {
        return res.status(500).json("Stock not found");
    }

    //delete Stock
    stock.isDeleted = true;

    //save Deleted Stock
    try {
        await stock.save();
        return res.status(200).json("Stock deleted successfully");
    }
    catch (err) {
        return res.status(500).json("Error deleting Stock");
    }

};

