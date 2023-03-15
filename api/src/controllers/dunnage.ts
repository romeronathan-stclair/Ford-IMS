import { json, NextFunction, Request, Response } from "express";
import { Department, UserDocument } from "../models";
import { Dunnage, DunnageDocument } from "../models/dunnage";
import { check } from "express-validator";
import { ModelType } from "../enums/modelType";
import { CrudType } from "../enums/crudType";
import { getPage, getPageSize } from "../utils/pagination";
import { ImageRequest } from "../type/imageRequest";
import { uploadImage } from "./image";
import env from "../utils/env";
import { Types } from "mongoose";

//create Dunnage
export const createDunnage = async (req: Request, res: Response) => {
    await check("departmentId", "departmentId is not valid").isLength({ min: 1 }).run(req);
    await check("name", "name is not valid").isLength({ min: 1 }).run(req);
    await check("skidQuantity", "skidQuantity is not valid").isLength({ min: 1 }).run(req);
    await check("lowStock", "lowStock is not valid").isLength({ min: 1 }).run(req);
    await check("moderateStock", "moderateStock is not valid").isLength({ min: 1 }).run(req);
    await check("marketLocation", "marketLocation is not valid").isLength({ min: 1 }).run(req);

    req.body = JSON.parse(req.body.dunnage);

    const departmentId = req.body.departmentId;

    const department = await Department.findById({
        _id: departmentId,
        isDeleted: false
    });

    if (!department) {
        return res.status(200).json("Department not found");
    }

    const plantId = department.plantId;

    const user = req.user as UserDocument;

    const existingDunnage: DunnageDocument = (await Dunnage.findOne({
        departmentId: req.body.departmentId.toString(),
        name: req.body.name,
    })) as DunnageDocument;

    if (existingDunnage) {
        return res.status(500).json("Dunnage already exists");
    }

    const dunnage: DunnageDocument = new Dunnage({
        departmentId: req.body.departmentId.toString(),
        name: req.body.name,
        skidQuantity: req.body.skidQuantity,
        currentCount: 0,
        lowStock: req.body.lowStock,
        moderateStock: req.body.moderateStock,
        marketLocation: req.body.marketLocation,
        isDeleted: false
    });

    try {
        await dunnage.save();
    } catch (err) {
        return res.status(500).json("Error creating Dunnage" + err);
    }

    if (req.files) {
        const image = req.files.file;

        const imageRequest: ImageRequest = {
            itemId: dunnage._id.toString(),
            plantId: plantId,
            departmentId: dunnage.departmentId,
            modelType: ModelType.STOCK,
            image: image
        };

        await uploadImage(imageRequest)
            .then((result: any) => {
                dunnage.imageURL = env.app.apiUrl + "/" + result;

            })
            .catch((err: any) => {
                console.log(err);

                try {
                    dunnage.remove();
                }
                catch (err) {
                    console.log(err);
                }
                return res.status(500).json("Error creating Stock");
            });
    } else {
        dunnage.imageURL = env.app.apiUrl + "/images/defaultImage.png";
    }

    try {
        dunnage.save();
    } catch (err) {
        return res.status(500).json("Error creating Dunnage");
    }

    return res.status(200).json(dunnage);
};

//get Dunnage
export const getDunnage = async (req: Request, res: Response) => {
    const page = getPage(req);
    const pageSize = getPageSize(req);
    const departmentId = req.query.departmentId as string;
    const name = req.query.name ? decodeURIComponent(req.query.name.toString()) : undefined;
    const dunnageId = req.query.dunnageId;

    const query: any = {
        isDeleted: false
    }

    if (departmentId) {
        query["departmentId"] = departmentId;
    }

    if (name) {
        query["name"] = name;
    }

    if (dunnageId) {
        query["_id"] = new Types.ObjectId(dunnageId.toString());
    }

    const dunnageCount = await Dunnage.countDocuments(query);
    const dunnages = await Dunnage.find(query).skip(page * pageSize).limit(pageSize).exec();

    if (!dunnages || dunnages.length === 0) {
        return res.status(200).json("No Dunnage found");
    }

    return res.status(200).json(dunnages);
};

//update Dunnage
export const updateDunnage = async (req: Request, res: Response) => {
    await check("departmentId", "departmentId is not valid").isLength({ min: 1 }).run(req);
    await check("name", "name is not valid").isLength({ min: 1 }).run(req);
    await check("skidQuantity", "skidQuantity is not valid").isLength({ min: 1 }).run(req);
    await check("lowStock", "lowStock is not valid").isLength({ min: 1 }).run(req);
    await check("moderateStock", "moderateStock is not valid").isLength({ min: 1 }).run(req);
    await check("marketLocation", "marketLocation is not valid").isLength({ min: 1 }).run(req);

    const dunnageId = req.params.id;

    if (dunnageId === undefined) {
        return res.status(500).json("Dunnage Id required");
    }

    //find Dunnage by id
    const dunnage: DunnageDocument = (await Dunnage.findOne({
        _id: dunnageId,
        isDeleted: false
    })) as DunnageDocument;

    if (!dunnage) {
        return res.status(500).json("Dunnage not found");
    }

    const departmentId = dunnage.departmentId;

    const department = (await Department.findOne({
        _id: departmentId,
        isDeleted: false
    }));

    if (!department) {
        return res.status(500).json("Department not found");
    }

    //update Dunnage

    dunnage.name = req.body.name || dunnage.name;
    dunnage.skidQuantity = req.body.skidQuantity || dunnage.skidQuantity;
    dunnage.lowStock = req.body.lowStock || dunnage.lowStock;
    dunnage.moderateStock = req.body.moderateStock || dunnage.moderateStock;
    dunnage.departmentId = req.body.departmentId || dunnage.departmentId;
    dunnage.marketLocation = req.body.marketLocation || dunnage.marketLocation;

    if (req.files) {
        const image = req.files.file;

        const imageRequest: ImageRequest = {
            itemId: dunnage._id.toString(),
            plantId: department.plantId,
            departmentId: dunnage.departmentId,
            modelType: ModelType.DUNNAGE,
            image: image,
            oldImage: dunnage.imageURL
        };

        await uploadImage(imageRequest)
            .then((result: any) => {
                dunnage.imageURL = env.app.apiUrl + "/" + result;

            })
            .catch((err: any) => {
                console.log(err);

                try {
                    dunnage.remove();
                }
                catch (err) {
                    console.log(err);
                }
                return res.status(500).json("Error creating Stock");
            });
    }

    //save Dunnage
    try {
        await dunnage.save();
        return res.status(200).json("Dunnage updated successfully");
    } catch (err) {
        return res.status(500).json("Error updating Dunnage");
    }
};

// delete Dunnage
export const deleteDunnage = async (req: Request, res: Response) => {
    const dunnageId = req.params.id;
    await check("id", "id is not valid").isLength({ min: 1 }).run(req);

    // find Dunnage by id
    const dunnage: DunnageDocument = (await Dunnage.findOne({
        _id: dunnageId,
        isDeleted: false,
    })) as DunnageDocument;

    if (!dunnage) {
        return res.status(500).json("Dunnage not found");
    }

    // delete Dunnage
    dunnage.isDeleted = true;

    // save Dunnage
    try {
        await dunnage.save();
        return res.status(200).json("Dunnage deleted successfully");
    } catch (err) {
        return res.status(500).json("Error deleting Dunnage" + err);
    }
};

