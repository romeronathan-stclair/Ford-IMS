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
import { ProductDunnage, ProductDunnageDocument } from "../models/productDunnage";

export const createProductDunnage = async (req: Request, res: Response) => {
    await check("productId", "productId is not valid")
        .isLength({ min: 1 })
        .run(req);
    await check("dunnageId", "dunnageId is not valid")



    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json(errors);
    }

    const user: UserDocument = req.user as UserDocument;
    const productDunnage: ProductDunnageDocument = (await ProductDunnage.findOne({
        productId: req.body.productId,
        isDeleted: false,
    })) as ProductDunnageDocument;

    if (productDunnage) {
        return res.status(500).json("ProductDunnage already exists for this product");
    }

    const newProductDunnage = new ProductDunnage({
        productId: req.body.productId,
        dunnageId: req.body.dunnageId,
        isDeleted: false,
    });
    const response = {
        productDunnage: newProductDunnage,
        message: "ProductDunnage created successfully"
    };

    try {
        await newProductDunnage.save();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(error);
    }
};



export const deleteProductDunnage = async (req: Request, res: Response) => {
    await check("id", "id is not valid").isLength({ min: 1 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json(errors);
    }

    const productDunnage: ProductDunnageDocument = (await ProductDunnage.findOne({
        _id: req.params.id,
        isDeleted: false,
    })) as ProductDunnageDocument;

    if (!productDunnage) {
        return res.status(500).json("ProductDunnage does not exist");
    }
    productDunnage.isDeleted = true;

    const response = {
        productDunnage: productDunnage,
        message: "ProductDunnage deleted successfully"
    };

    try {
        await productDunnage.save();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(error);
    }
};

