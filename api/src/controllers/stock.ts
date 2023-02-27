import { json, NextFunction, Request, Response } from "express";
import { UserDocument } from "../models";
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
    await check("currentCount", "currentCount is not valid").isLength({min: 1}).run(req);
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
        currentCount: req.body.currentCount,
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
    newStock.currentCount = req.body.currentCount;
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

//get Stock by Id
export const getStockById = async (req: Request, res: Response) => {
    await check("id", "id is not valid").isLength({min: 1}).run(req);

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
    await check("departmentId", "departmentId is not valid").isLength({min: 1}).run(req);

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
    await check("name", "name is not valid").isLength({min: 1}).run(req);

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
    await check("partNumber", "partNumber is not valid").isLength({min: 1}).run(req);

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
    await check("id", "id is not valid").isLength({min: 1}).run(req);
    await check("departmentId", "departmentId is not valid").isLength({min: 1}).run(req);
    await check("name", "name is not valid").isLength({min: 1}).run(req);
    await check("partNumber", "partNumber is not valid").isLength({min: 1}).run(req);
    await check("stockPerTote", "stockPerTote is not valid").isLength({min: 1}).run(req);
    await check("toteQuantity", "toteQuantity is not valid").isLength({min: 1}).run(req);
    await check("skidQuantity", "skidQuantity is not valid").isLength({min: 1}).run(req);
    await check("lowStock", "lowStock is not valid").isLength({min: 1}).run(req);
    await check("imageURL", "imageURL is not valid").isLength({min: 1}).run(req);

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
    await check("id", "id is not valid").isLength({min: 1}).run(req);

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

