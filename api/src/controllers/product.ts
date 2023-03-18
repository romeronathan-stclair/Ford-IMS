import { json, NextFunction, Request, Response } from "express";
import { User, UserDocument, Department, DepartmentDocument, Event, Product, ProductDocument } from "../models";
import { Stock, StockDocument } from "../models/stock";
import { Dunnage, DunnageDocument } from "../models/dunnage";
import { ProductStock, ProductStockDocument } from "../models/productStock";
import { ProductDunnage, ProductDunnageDocument } from "../models/productDunnage";
import { check, validationResult } from "express-validator";
import { ModelType } from "../enums/modelType";
import { CrudType } from "../enums/crudType";
import { getPage, getPageSize } from "../utils/pagination";
import { Types } from "mongoose";
import { ImageRequest } from "../type/imageRequest";
import { uploadImage } from "./image";
import env from "../utils/env";
import { createProductStock } from "./productStock";
import { createProductDunnage } from "./productDunnage";

//create Product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {

    req.body = JSON.parse(req.body.product);
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


    if (req.files) {
        console.log("HERE IS THE FILE" + JSON.stringify(req.files));

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
        product.imageURL = env.app.apiUrl + "/images/defaultImage.png";
    }

    if (req.body.stocks) {

        const stocks = req.body.stocks;



        for (const stock of stocks) {

            const productStock: ProductStockDocument = new ProductStock({
                productId: product._id,
                stockId: stock.stockId,
                departmentId: departmentId,
                usePerProduct: stock.usePerProduct,
                isDeleted: false
            });

            try {
                const savedProductStock = await productStock.save();
                console.log(`Saved product stock ${savedProductStock._id}`);
            } catch (error) {
                console.error(`Error saving product stock: ${error}`);
            }
        }
    }

    if (req.body.dunnage) {
        const dunnage = req.body.dunnage;
        console.log(req.body.dunnage);
        const newProductDunnage = new ProductDunnage({
            productId: product._id,
            dunnageId: dunnage.dunnageId,
            departmentId: departmentId,
            isDeleted: false,
        });

        try {
            await newProductDunnage.save();
        } catch (err) {
            console.log("Error saving dunnage" + err);
        }
    }


    try {
        product.save();
    }
    catch (err) {
        product.remove();
        return res.status(500).json("Error creating Product");
    }


    return res.status(200).json(product);
};

//get Product
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    const page = getPage(req);
    const pageSize = getPageSize(req);
    const departmentId = req.query.departmentId;
    const userId = req.query.userId;
    const plantId = req.query.plantId;
    const productId = req.query.productId;
    const name = req.query.name ? decodeURIComponent(req.query.name.toString()) : undefined;
    const partNumber = req.query.partNumber;

    const query: any = {
        isDeleted: false,
    }

    if (userId) {
        const user = await User.findOne({ _id: userId, isDeleted: false });
        if (user) {
            const departmentIds = user.plants.map(plant => plant.departments.map(department => department));
            query["departmentId"] = { $in: departmentIds };
        }
    }
    if (departmentId) {
        query["departmentId"] = departmentId;
    }
    if (plantId) {
        query["plantId"] = plantId;
    }

    if (productId) {
        query["_id"] = productId;
    }

    if (name) {
        query["name"] = { $regex: name, $options: "i" };
    }


    if (partNumber) {
        query["partNumber"] = partNumber;
    }

    const products = await Product.find(query).skip(page * pageSize).limit(pageSize).exec();
    const productCount = await Product.countDocuments(query).exec();

    let response = {
        products: products,
        productCount: productCount
    }

    return res.status(200).json(response);
};

//update Product
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    await check("departmentId", "Department Id is required").isLength({ min: 1 }).run(req);
    await check("productId", "Product Id is required").isLength({ min: 1 }).run(req);
    await check("name", "Name is required").isLength({ min: 1 }).run(req);
    await check("partNumber", "Part Number is required").isLength({ min: 1 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const productId = req.params.id;

    if (productId === undefined) {
        return res.status(500).json("Product Id is required");
    }

    //find product by id
    const product: ProductDocument = (await Product.findOne({
        _id: productId,
        isDeleted: false
    })) as ProductDocument;

    if (!product) {
        return res.status(500).json("Product not found");
    }

    const departmentId = product.departmentId;

    const department = await Department.findOne({
        _id: departmentId,
        isDeleted: false
    });

    if (!department) {
        return res.status(500).json("Department not found");
    }

    product.name = req.body.name || product.name;
    product.partNumber = req.body.partNumber || product.partNumber;
    product.dailyTarget = req.body.dailyTarget || product.dailyTarget;
    product.marketLocation = req.body.marketLocation || product.marketLocation;
    product.departmentId = req.body.departmentId || product.departmentId;

    if (req.files) {
        const image = req.files.file;

        const imageRequest: ImageRequest = {
            itemId: product._id.toString(),
            plantId: department.plantId,
            departmentId: product.departmentId,
            modelType: ModelType.PRODUCT,
            image: image,
            oldImage: product.imageURL
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
    }

    try {
        await product.save();
        return res.status(500).json("Product updated successfully");
    } catch (err) {
        return res.status(500).json("Error updating Product: " + err);
    }
};

//delete Product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    await check("productId", "Product Id is required").isLength({ min: 1 }).run(req);

    //find product by id
    const product: ProductDocument = (await Product.findOne({
        _id: productId,
        isDeleted: false
    })) as ProductDocument;

    if (!product) {
        return res.status(500).json("Product not found");
    }

    //delete product
    product.isDeleted = true;

    //save delete product
    try {
        await product.save();
        return res.status(200).json("Product deleted successfully");
    } catch (err) {
        return res.status(500).json("Error deleting Product: " + err);
    }
};