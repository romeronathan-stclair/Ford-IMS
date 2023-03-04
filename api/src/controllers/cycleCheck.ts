import { json, NextFunction, Request, Response } from "express";
import { Department, DepartmentDocument, Dunnage, DunnageDocument, UserDocument } from "../models";
import { Stock, StockDocument } from "../models/stock";
import { check } from "express-validator";
import { ModelType } from "../enums/modelType";
import { CrudType } from "../enums/crudType";
import { getPage, getPageSize } from "../utils/pagination";
import { ImageRequest } from "../type/imageRequest";
import { uploadImage } from "./image";
import { Types } from "mongoose";
import env from "../utils/env";
import { CycleCheckList } from "../type/CycleCheckList";

//create Stock
export const getCycleCheck = async (req: Request, res: Response) => {

    const user = req.user as UserDocument;
    let cycleCheckList: CycleCheckList[] = [];


    const plant = user.plants.find((plant) => {
        if (plant.isActive) {
            return plant
        }
    });
    if (!plant) {
        return res.status(500).json("No active plants");
    }
    const departmentIds = plant.departments.map((department) => {
        return department;
    });

    for (const departmentId of departmentIds) {

        const department: DepartmentDocument = (await Department.findOne({
            _id: departmentId,
            isDeleted: false
        })) as DepartmentDocument;

        if (!department) {
            return res.status(500).json("Department does not exist");
        }


        let stockList: StockDocument[] = (await Stock.find({
            departmentId: departmentId,
            isDeleted: false
        })) as StockDocument[];

        let dunnage: DunnageDocument[] = (await Dunnage.find({
            departmentId: departmentId,
            isDeleted: false
        })) as DunnageDocument[];

        cycleCheckList.push({
            departmentId: departmentId,
            departmentName: department.departmentName,
            stockList: stockList,
            dunnage: dunnage
        })





    }


    return res.status(200).json(cycleCheckList).end();



}