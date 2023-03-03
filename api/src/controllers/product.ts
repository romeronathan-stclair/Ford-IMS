import { json, NextFunction, Request, Response } from "express";
import { User, UserDocument, Department, DepartmentDocument, Event, Product, ProductDocument } from "../models";
import { Stock, StockDocument } from "../models/stock";
import { Dunnage, DunnageDocument } from "../models/dunnage";
import { check, validationResult } from "express-validator";
import { ModelType } from "../enums/modelType";
import { CrudType } from "../enums/crudType";
import { getPage, getPageSize } from "../utils/pagination";
import { Types } from "mongoose";
import { ImageRequest } from "../type/imageRequest";
import { uploadImage } from "./image";
import env from "../utils/env";

//create Product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    await check("name", "Name is required").isLength({ min: 1 }).run(req);
    await check("partNumber", "Part Number is required").isLength({ min: 1 }).run(req);
    await check("departmentId", "Department Id is required").isLength({ min: 1 }).run(req);
    await check("dailyTarget", "Daily Target is required").isLength({ min: 1 }).run(req);
    await check("marketLocation", "Market Location is required").isLength({ min: 1 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const departmentId = req.body.departmentId;

    const department = await Department.findById({
        _id: departmentId,
        isDeleted: false
    });

    if (!department) {
        return res.status(500).json("Department not found");
    }

    const plantId = department.plantId;

    const user = req.user as UserDocument;

    const existingProduct: ProductDocument = (await Product.findOne({
        departmentId: departmentId,
        name: req.body.name
    })) as ProductDocument;

    if (existingProduct) {
        return res.status(500).json("Product already exists");
    }

    const product: ProductDocument = new Product({
        name: req.body.name,
        partNumber: req.body.partNumber,
        departmentId: departmentId.toString(),
        dailyTarget: req.body.dailyTarget,
        marketLocation: req.body.marketLocation,
        isDeleted: false
    });

    try {
        await product.save();
    } catch (err) {
        return res.status(500).json("Error creating Product: " + err);
    }

    if (req.files) {
        console.log(req.files)
        const image = req.files.file;

        const imageRequest: ImageRequest = {
            itemId: product._id.toString(),
            plantId: plantId,
            departmentId: product.departmentId,
            modelType: ModelType.PRODUCT,
            image: image,

        };

        await uploadImage(imageRequest)
            .then((result: any) => {
                product.imageURL = env.app.apiUrl + "/" + result;

            })
            .catch((err: any) => {
                console.log(err);

                try {
                    product.remove();
                }
                catch (err) {
                    console.log(err);
                }
                return res.status(500).json("Error creating Product");
            });
    } else {
        product.imageURL = env.app.apiUrl + "/images/defaultProduct.png";
    }

    try {
        product.save();
    }
    catch (err) {
        product.remove();
        return res.status(500).json("Error creating Product");
    }

    //TODO add the productStock controllers createProductStock function here

    //TODO add the productDunnage controllers createProductDunnage function here


    return res.status(200).json(product);
};

//get Product
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    
};

//update Product
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    
};

//delete Product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {

};