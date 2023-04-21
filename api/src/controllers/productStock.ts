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
} from "../models";
import passwordSchema from "../utils/passwordValidator";
import { createRandomToken } from "../utils/randomGenerator";

import bcrypt from "bcrypt";

import logger from "../utils/logger";
import { getPage, getPageSize } from "../utils/pagination";
import { CrudType } from "../enums/crudType";
import mongoose from "mongoose";
import { ModelType } from "../enums/modelType";
import { ProductStock, ProductStockDocument } from "../models/productStock";

export const createProductStock = async (req: Request, res: Response) => {
    await check("productId", "productId is not valid")
        .isLength({ min: 1 })
        .run(req);
    await check("name", "name is not valid").isLength({ min: 1 }).run(req);
    await check("partNumber", "partNumber is not valid")

        .isLength({ min: 1 })
        .run(req);
    await check("stockId", "stockId is not valid").isLength({ min: 1 }).run(req);
    await check("departmentId", "departmentId is not valid")
        .isLength({ min: 1 })
        .run(req);
    await check("dailyTarget", "dailyTarget is not valid")
        .isLength({ min: 1 })
        .run(req);
    await check("usePerProduct", "usePerProduct is not valid")
        .isLength({ min: 1 })
        .run(req);


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json(errors);
    }



    const user: UserDocument = req.user as UserDocument;
    const productStock: ProductStockDocument = (await ProductStock.findOne({
        productId: req.body.productId,
        stockId: req.body.stockId,
        isDeleted: false,
        departmentId: req.body.departmentId
    }) as ProductStockDocument);

    if (productStock) {
        return res.status(500).json("ProductStock already exists");
    }

    const newProductStock: ProductStockDocument = new ProductStock({
        productId: req.body.productId,
        stockId: req.body.stockId,
        departmentId: req.body.departmentId,
        usePerProduct: req.body.usePerProduct,
        isDeleted: false
    });

    const response = {
        productStock: newProductStock,
        message: "ProductStock created successfully"
    };


    try {
        await newProductStock.save();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(error);
    }
};



export const deleteProductStock = async (req: Request, res: Response, next: NextFunction) => {
    await check("id", "Product Id is required").isLength({ min: 1 }).run(req);

    const productStockId = req.params.id;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json(errors);
    }

    //find product by id
    const productStock: ProductStockDocument = (await ProductStock.findOne({
        _id: productStockId,
        isDeleted: false
    })) as ProductStockDocument;

    if (!productStock) {
        return res.status(500).json("Product not found");
    }

    //delete product
    productStock.isDeleted = true;

    //save delete product
    try {
        await productStock.save();
        return res.status(200).json("Product deleted successfully");
    } catch (err) {
        return res.status(500).json("Error deleting Product: " + err);
    }
};

export const changeUserPerProduct = async (req: Request, res: Response, next: NextFunction) => {
    await check("productStockId", "productId is not valid").isLength({ min: 1 }).run(req);
    await check("usePerProduct", "stockId is not valid").isLength({ min: 1 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json(errors);
    }

    const productStockId = req.body.productStockId;
    const usePerProduct = req.body.usePerProduct;

    const productStock: ProductStockDocument = (await ProductStock.findOne({
        _id: productStockId,
        isDeleted: false
    })) as ProductStockDocument;

    if (!productStock) {
        return res.status(500).json("Product not found");
    }

    productStock.usePerProduct = usePerProduct;

    try {
        await productStock.save();
        return res.status(200).json({
            message: "Product updated successfully",
            productStock: productStock
        }
        );
    }
    catch (err) {
        return res.status(500).json("Error updating Product: " + err);
    }




}
export const getProductStock = async (req: Request, res: Response) => {
    const page = getPage(req);
    const pageSize = getPageSize(req);
    const productId = req.query.productId;

    const query: any = {
        isDeleted: false,
    };

    if (productId) {
        query["productId"] = productId;
    }


    const productStocks = await ProductStock.find(
        query
    ).skip(page * pageSize).limit(pageSize).exec();
    const count = await ProductStock.countDocuments(query);


    return res.status(200).json({
        productStocks: productStocks,
        count: count
    });
}
