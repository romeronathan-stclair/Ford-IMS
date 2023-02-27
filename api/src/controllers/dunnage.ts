import { json, NextFunction, Request, Response } from "express";
import { UserDocument } from "../models";
import { Dunnage, DunnageDocument } from "../models/dunnage";
import { check } from "express-validator";
import { ModelType } from "../enums/modelType";
import { CrudType } from "../enums/crudType";
import { getPage, getPageSize } from "../utils/pagination";

//create Dunnage
export const createDunnage = async (req: Request, res: Response) => {
    await check("departmentId", "departmentId is not valid").isLength({min: 1}).run(req);
    await check("name", "name is not valid").isLength({min: 1}).run(req);
    await check("skidQuantity", "skidQuantity is not valid").isLength({min: 1}).run(req);
    await check("currentCount", "currentCount is not valid").isLength({min: 1}).run(req);
    await check("lowStock", "lowStock is not valid").isLength({min: 1}).run(req);
    await check("moderateStock", "moderateStock is not valid").isLength({min: 1}).run(req);
    await check("imageURL", "imageURL is not valid").isLength({min: 1}).run(req);

    //check if Dunnage already exists
    let response;
    const dunnage: DunnageDocument = (await Dunnage.findOne({
        departmentId: req.body.departmentId,
        name: req.body.name,
        skidQuantity: req.body.skidQuantity,
        currentCount: req.body.currentCount,
        lowStock: req.body.lowStock,
        moderateStock: req.body.moderateStock,
        imageURL: req.body.imageURL,
        isDeleted: false
    })) as DunnageDocument;

    if (dunnage) {
        return res.status(500).json("Dunnage already exists");
    }

    //create new Dunnage
    const newDunnage: DunnageDocument = new Dunnage();
    newDunnage.departmentId = req.body.departmentId;
    newDunnage.name = req.body.name;
    newDunnage.skidQuantity = req.body.skidQuantity;
    newDunnage.currentCount = req.body.currentCount;
    newDunnage.lowStock = req.body.lowStock;
    newDunnage.moderateStock = req.body.moderateStock;
    newDunnage.imageURL = req.body.imageURL;
    newDunnage.isDeleted = false;

    //save Dunnage
    response = {
        dunnage: newDunnage,
        message: "Dunnage created successfully"
    }
    try {
        await newDunnage.save();
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json("Error creating Dunnage");
    }

};