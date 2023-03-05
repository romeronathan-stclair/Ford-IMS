import { json, NextFunction, Request, Response } from "express";
import { Department, DepartmentDocument, Dunnage, DunnageDocument, ProductDunnage, UserDocument } from "../models";
import { Stock, StockDocument } from "../models/stock";
import { check, validationResult } from "express-validator";
import { CycleCheckList } from "../type/CycleCheckList";

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

export const submitCycleCheck = async (req: Request, res: Response) => {
    await check("cycleCheckList", "stocks is not valid").isLength({ min: 1 }).run(req);

    const errors = validationResult(req);

    const stockSaveList = [];
    const dunnageSaveList = [];

    if (!errors.isEmpty()) {
        return res.status(500).json(errors);
    }

    const cycleCheckList = req.body.cycleCheckList;

    try {
        for (const cycleCheck of cycleCheckList) {

            const departmentId = cycleCheck.departmentId;

            const department = await Department.findById({
                _id: departmentId,
                isDeleted: false,
            });

            if (!department) {
                return res.status(500).json("Department does not exist");
            }

            if (cycleCheck.stockList) {
                const departmentStocks = await Stock.find({
                    departmentId: departmentId,
                    isDeleted: false
                });

                const stockList = cycleCheck.stockList;

                for (const stock of stockList) {

                    const matchedStock = departmentStocks.find((s: any) => {
                        return s._id.toString() === stock._id.toString();
                    });
                    if (!matchedStock) {
                        return res.status(500).json("Stock does not exist");
                    }
                    matchedStock.currentCount = stock.currentCount;

                    stockSaveList.push(matchedStock);


                }
            }

            if (cycleCheck.dunnage) {
                const departmentDunnage = await Dunnage.find({
                    departmentId: departmentId,
                    isDeleted: false
                });
                const dunnageList = cycleCheck.dunnage;
                for (const dunnage of dunnageList) {
                    const matchedDunnage = departmentDunnage.find((d: any) => {
                        return d._id.toString() === dunnage._id.toString();
                    });
                    if (!matchedDunnage) {
                        return res.status(500).json("Dunnage does not match");
                    }
                    matchedDunnage.currentCount = dunnage.currentCount;

                    dunnageSaveList.push(matchedDunnage);
                }
            }
        }
    } catch (err) {
        return res.status(500).json(err);
    }

    try {
        if (stockSaveList.length > 0) {
            for (const stock of stockSaveList) {
                await stock.save();
            }
        }
        if (dunnageSaveList.length > 0) {
            for (const dunnage of dunnageSaveList) {
                await dunnage.save();
            }
        }
    } catch (err) {
        return res.status(500).json(err);
    }

    return res.status(200).json("Cycle Check Submitted");
};
