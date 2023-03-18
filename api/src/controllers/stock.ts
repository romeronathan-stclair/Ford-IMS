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
    await check("stockQtyPerTote", "stockQtyPerTote is not valid").isLength({ min: 1 }).run(req);
    await check("totesPerSkid", "totesPerSkid is not valid").isLength({ min: 1 }).run(req);
    await check("lowStock", "lowStock is not valid").isLength({ min: 1 }).run(req);
    await check("moderateStock", "moderateStock is not valid").isLength({ min: 1 }).run(req);
    await check("marketLocation", "marketLocation is not valid").isLength({ min: 1 }).run(req);
    await check("roughStock", "roughStock is not valid").isLength({ min: 1 }).run(req);
    await check("isSubAssembly", "isSubAssembly is not valid").isLength({ min: 1 }).run(req);
    await check("totalQuantity", "totalQuantity is not valid").isLength({ min: 1 }).run(req);


    console.log(req.body);

    req.body = JSON.parse(req.body.stock);

    const departmentId = req.body.departmentId;

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
        totalStockPerSkid: req.body.totalStockPerSkid,
        stockQtyPerTote: req.body.stockQtyPerTote,
        totesPerSkid: req.body.totesPerSkid,
        currentCount: 0,
        totalAvailableQty: 0,
        roughStock: req.body.roughStock,
        isSubAssembly: req.body.isSubAssembly,
        lowStock: req.body.lowStock,
        moderateStock: req.body.moderateStock,
        marketLocation: req.body.marketLocation,
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
    } else {
        stock.imageURL = env.app.apiUrl + "/images/defaultImage.png";
    }

    try {
        stock.save();
    }
    catch (err) {
        stock.remove();
        return res.status(500).json("Error creating Stock");
    }

    return res.status(200).json(stock);
};

//get Stock
export const getStock = async (req: Request, res: Response) => {
    const page = getPage(req);
    const pageSize = getPageSize(req);
    const departmentId = req.query.departmentId;
    const name = req.query.name ? decodeURIComponent(req.query.name.toString()) : undefined;
    const partNumber = req.query.partNumber;
    const stockId = req.query.stockId;

    const query: any = {
        isDeleted: false,
    };

    if (departmentId) {
        query["departmentId"] = departmentId;
        console.log(departmentId);
    }

    if (name) {
        query["name"] = name;
        console.log(name);
    }

    if (partNumber) {
        query["partNumber"] = partNumber;
        console.log(partNumber);
    }

    if (stockId) {
        query["_id"] = new Types.ObjectId(stockId.toString());
    }

    const stockCount = await Stock.countDocuments(query);
    const stocks = await Stock.find(query).skip(page * pageSize).limit(pageSize).exec();

    let response = {
        stocks: stocks,
        stockCount: stockCount,
    }



    return res.status(200).json(response);
};


//update Stock
export const updateStock = async (req: Request, res: Response) => {
    await check("stockId", "stockId is not valid").isLength({ min: 1 }).run(req);

    const stockId = req.body.stockId;

    if (stockId === undefined) {
        return res.status(500).json("Stock Id Required.");
    }


    //find Stock by Id
    const stock: StockDocument = (await Stock.findOne({
        _id: stockId,
        isDeleted: false
    })) as StockDocument;

    if (!stock) {
        return res.status(500).json("Stock not found");
    }

    const departmentId = stock.departmentId;

    const department = (await Department.findOne({
        _id: departmentId,
        isDeleted: false
    })) as DepartmentDocument;


    if (!department) {
        return res.status(500).json("Department not found");
    }

    stock.name = req.body.name || stock.name;
    stock.partNumber = req.body.partNumber || stock.partNumber;
    stock.stockQtyPerTote = req.body.stockQtyPerTote || stock.stockQtyPerTote;
    stock.totesPerSkid = req.body.totesPerSkid || stock.totesPerSkid;
    stock.lowStock = req.body.lowStock || stock.lowStock;
    stock.moderateStock = req.body.moderateStock || stock.moderateStock;
    stock.marketLocation = req.body.marketLocation || stock.marketLocation;
    stock.roughStock = req.body.roughStock || stock.roughStock;
    stock.isSubAssembly = req.body.isSubAssembly || stock.isSubAssembly;
    stock.departmentId = req.body.departmentId || stock.departmentId;

    if (req.files) {
        const image = req.files.file;

        const imageRequest: ImageRequest = {
            itemId: stock._id.toString(),
            plantId: department.plantId,
            departmentId: stock.departmentId,
            modelType: ModelType.STOCK,
            image: image,
            oldImage: stock.imageURL
        };

        await uploadImage(imageRequest)
            .then((result: any) => {
                stock.imageURL = env.app.apiUrl + "/" + result;

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



    //save Updated Stock
    try {
        await stock.save();
        return res.status(200).json("Stock updated successfully");
    }
    catch (err) {
        return res.status(500).json("Error updating Stock");
    }
};

// delete Stock
export const deleteStock = async (req: Request, res: Response) => {
    const stockId = req.params.id;
    await check("id", "id is not valid").isLength({ min: 1 }).run(req);

    //find Stock by Id
    const stock: StockDocument = (await Stock.findOne({
        _id: stockId,
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


