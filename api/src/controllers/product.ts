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
import * as forecastService from "../services/forecastService";

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
        product.imageURL = env.app.apiUrl + "/public/default-image";
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

    const event = new Event({
        plantId: plantId,
        departmentId: departmentId,
        eventDate: new Date().toDateString(),
        eventTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
        userId: user._id.toString(),
        operationType: CrudType.CREATE,
        modelType: ModelType.PRODUCT,
        userName: user.name,
        userEmailAddress: user.email,
        itemId: product._id.valueOf(),
        itemName: product.name,
    });


    try {
        product.save();
        await event.save();
    }
    catch (err) {
        product.remove();
        return res.status(500).json("Error creating Product");
    }


    return res.status(200).json(product);
};

// reassign product stock
export const reassignProductStock = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.body.productId;
    console.log("Product Id: " + productId);

    const productStocks = await ProductStock.find({
        productId: productId,
        isDeleted: false
    }).exec();


    // Parse the incoming stocks
    const incomingStocks = req.body.stocks;


    console.log("product stocks " + JSON.stringify(incomingStocks));

    // Iterate through the existing product stocks and delete the ones not in the incoming stocks
    for (const existingStock of productStocks) {
        const isIncoming = incomingStocks.some((incomingStock: any) => incomingStock._id == existingStock.stockId);
        console.log("Is incoming: " + isIncoming);

        if (!isIncoming) {
            existingStock.isDeleted = true;
            await existingStock.save();

        }
    }

    // Iterate through the incoming stocks and add new ones if they don't already exist
    for (const incomingStock of incomingStocks) {
        const alreadyExists = productStocks.some(existingStock => existingStock.stockId == incomingStock._id);

        if (!alreadyExists) {
            const newProductStock = new ProductStock({
                productId: productId,
                stockId: incomingStock._id,
                departmentId: incomingStock.departmentId, // Assuming departmentId is included in the incomingStock object
                usePerProduct: incomingStock.usePerProduct,
                isDeleted: false
            });

            try {
                await newProductStock.save();
            } catch (error) {
                console.error(`Error saving new product stock: ${error}`);
            }
        }
    }
    try {
        forecastService.forecastProduct(productId);
        return res.status(200).json({ message: 'Product stocks reassigned successfully.' });
    } catch (error) {
        console.error(`Error forecasting product: ${error}`);
    }

};
// reassign product dunnage
export const reassignProductDunnage = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.body.productId;
    console.log("Product Id: " + productId);

    const productDunnages = await ProductDunnage.find({
        productId: productId,
        isDeleted: false
    }).exec();

    // Parse the incoming dunnage array
    const incomingDunnage = req.body.dunnage;

    console.log("Incoming dunnage: " + JSON.stringify(productDunnages));

    // Iterate through the existing product dunnages and delete the ones not in the incoming dunnage
    for (const existingDunnage of productDunnages) {
        const isIncoming = incomingDunnage.some((incomingDunnageItem: any) => incomingDunnageItem._id === existingDunnage.dunnageId);
        console.log("Is incoming: " + isIncoming);

        if (!isIncoming) {
            existingDunnage.isDeleted = true;
            await existingDunnage.save();
        }
    }

    // Iterate through the incoming dunnage and add new ones if they don't already exist
    for (const incomingDunnageItem of incomingDunnage) {
        const alreadyExists = productDunnages.some(existingDunnage => existingDunnage.dunnageId === incomingDunnageItem._id);

        if (!alreadyExists) {
            const newProductDunnage = new ProductDunnage({
                productId: productId,
                dunnageId: incomingDunnageItem._id,
                departmentId: incomingDunnageItem.departmentId, // Assuming departmentId is included in the incomingDunnageItem object
                isDeleted: false
            });

            try {
                await newProductDunnage.save();
            } catch (error) {
                return res.status(500).json({ message: 'Error saving new product dunnage.' });
            }
        }
    }
    try {
        forecastService.forecastProduct(productId);
        return res.status(200).json({ message: 'Product dunnage reassigned successfully.' });
    } catch (error) {
        return res.status(200).json({ message: 'Product dunnage assigned successfully but error forecasting product.' });
    }
}


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
    console.log("update product");

    req.body = JSON.parse(req.body.product);



    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const productId = req.body.productId;

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

    const plantId = department.plantId;
    const user = req.user as UserDocument;

    product.name = req.body.name || product.name;
    product.partNumber = req.body.partNumber || product.partNumber;
    product.dailyTarget = req.body.dailyTarget || product.dailyTarget;
    product.marketLocation = req.body.marketLocation || product.marketLocation;
    product.departmentId = req.body.departmentId || product.departmentId;

    if (req.body.name) {
        const p: ProductDocument = (await Product.findOne({
            name: product.name,
            isDeleted: false
        })) as ProductDocument;

        if (p) {
            if (p._id.toString() !== product._id.toString()) {
                return res.status(500).json("Product already exists with this name");
            }
        }
    }


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
        console.log(imageRequest);

        await uploadImage(imageRequest)
            .then((result: any) => {
                product.imageURL = env.app.apiUrl + "/" + result;

            })
            .catch((err: any) => {
                console.log(err);


                return res.status(500).json("Error Updating Product");
            });
    }

    const event = new Event({
        plantId: plantId,
        departmentId: departmentId,
        eventDate: new Date().toDateString(),
        eventTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
        userId: user._id.toString(),
        operationType: CrudType.UPDATE,
        modelType: ModelType.PRODUCT,
        userName: user.name,
        userEmailAddress: user.email,
        itemId: product._id.valueOf(),
        itemName: product.name,
    });

    try {
        await product.save();
        await event.save();
        return res.status(200).json("Product updated successfully");
    } catch (err) {
        return res.status(500).json("Error updating Product: " + err);
    }
};

export const changeProuctionTarget = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.body.productId;
    const dailyTarget = req.body.dailyTarget;

    //find product by id
    const product: ProductDocument = (await Product.findOne({
        _id: productId,
        isDeleted: false
    })) as ProductDocument;

    if (!product) {
        return res.status(500).json("Product not found");
    }

    product.dailyTarget = dailyTarget;

    try {
        await product.save();
        return res.status(200).json("Product updated successfully");
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

    const departmentId = product.departmentId;

    const department = (await Department.findOne({
        _id: departmentId,
        isDeleted: false
    })) as DepartmentDocument;

    if (!department) {
        return res.status(500).json("Department not found");
    }

    const plantId = department.plantId;
    const user = req.user as UserDocument;

    const event = new Event({
        plantId: plantId,
        departmentId: departmentId,
        eventDate: new Date().toDateString(),
        eventTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
        userId: user._id.toString(),
        operationType: CrudType.DELETE,
        modelType: ModelType.PRODUCT,
        userName: user.name,
        userEmailAddress: user.email,
        itemId: product._id.valueOf(),
        itemName: product.name
    });

    const productStocks = await ProductStock.find({
        productId: productId,
        isDeleted: false
    });


    for (let i = 0; i < productStocks.length; i++) {
        const productStock = productStocks[i];
        productStock.isDeleted = true;
        await productStock.save();
    }
    const productDunnage = await ProductDunnage.find({
        productId: productId,
        isDeleted: false
    });


    for (let i = 0; i < productDunnage.length; i++) {
        const pDunnage = productDunnage[i];
        pDunnage.isDeleted = true;
        await pDunnage.save();
    }


    try {
        await product.save();
        await event.save();
        return res.status(200).json("Product deleted successfully");
    } catch (err) {
        return res.status(500).json("Error deleting Product: " + err);
    }
};