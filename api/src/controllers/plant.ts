import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import passport from "passport";
import {
    User,
    UserDocument,
    Invite,
    PlantDocument,
    Plant,
    DepartmentDocument,
    Department,
    Event,
} from "../models";
import passwordSchema from "../utils/passwordValidator";
import { createRandomToken } from "../utils/randomGenerator";

import bcrypt from "bcrypt";

import logger from "../utils/logger";
import { getPage, getPageSize } from "../utils/pagination";
import { CrudType } from "../enums/crudType";
import mongoose from "mongoose";

export const createPlant = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await check("plantName", "plantName is not valid")
        .isLength({ min: 1 })
        .run(req);
    await check("plantLocation", "plantLocation is not valid")
        .isLength({ min: 1 })
        .run(req);

    let response;
    let departments: DepartmentDocument[] = [];
    let departmentIds: [String] = [""];

    const plant: PlantDocument = (await Plant.findOne({
        plantName: req.body.plantName,
    })) as PlantDocument;
    const user: UserDocument = req.user as UserDocument;

    if (plant) {
        return res.status(500).json("Plant already exists!");
    }

    const newPlant: PlantDocument = new Plant();
    newPlant.plantName = req.body.plantName;
    newPlant.plantLocation = req.body.plantLocation;
    newPlant.isDeleted = false;

    try {
        await newPlant.save();
        user.plants.push({
            plantId: newPlant._id.valueOf(),
            departments: [""],
            isActive: false,
        });
        await user.save();
    } catch (err) {
        return res.status(500).json({ err });
    }

    if (req.body.departments) {
        if (!Array.isArray(req.body.departments)) {
            newPlant.remove();
            return res.status(400).json("Departments must be an array");
        }

        const departmentNames = req.body.departments.map(
            (department: any) => department.departmentName
        );

        const existingDepartments = await Department.find({
            departmentName: { $in: departmentNames },
        });

        if (existingDepartments.length > 0) {
            const existingDepartmentNames = existingDepartments.map(
                (department: any) => department.departmentName
            );
            newPlant.remove();
            return res
                .status(500)
                .json(
                    "Departments already exist with the names " +
                    existingDepartmentNames.join(", ")
                );
        } else {
            try {
                departments = req.body.departments.map((department: any) => {
                    const newDepartment: DepartmentDocument = new Department();
                    newDepartment.departmentName = department.departmentName;
                    newDepartment.plantId = newPlant._id.valueOf();
                    newDepartment.isDeleted = false;
                    return newDepartment;
                });
                await Promise.all(
                    departments.map((department: { save: () => any }) => {
                        return department.save();
                    })
                );
                departmentIds = departments.map((department: DepartmentDocument) =>
                    department._id.toString()
                ) as [String];
            } catch (err) {
                newPlant.remove();
                departments.forEach((department: { remove: () => any }) => {
                    department.remove();
                });
                return res.status(500).json("Error while creating departments." + err);
            }
        }
    }

    response = {
        plant: newPlant,
        message: "Plant created successfully",
    };

    try {
        response = {
            plant: newPlant,
            departments: departmentIds,
            message: "Plant and departments created successfully",
        };

        user.plants.push({
            plantId: newPlant._id.valueOf(),
            departments: departmentIds,
            isActive: false,
        });
        await user.save();
    } catch (err) {
        return res
            .status(500)
            .json("Error while creating plant and departments." + err);
    }

    const assignments = req.body.assignments as {
        userId: string;
        departments: string[];
    }[];

    await assignUsers(newPlant, departments, assignments)
        .then((result) => {
            response = {
                plant: newPlant,
                message: result,
            };
            return res.status(200).json(response);
        })
        .catch((err) => {
            response = {
                plant: newPlant,
                message: err,
            };
            try {
                newPlant.remove();

                departments.forEach((department: { remove: () => any }) => {
                    department.remove();
                });

                return res.status(500).json(err);
            } catch (err) {
                return res
                    .status(500)
                    .json("Error while creating plant and departments." + err);
            }
        });
};
export const getActivePlant = async (req: Request, res: Response) => {
    await check("id", "id is not valid").isLength({ min: 1 }).run(req);

    const user = req.user as UserDocument;

    const activePlantId = user.plants.find((plant) => plant.isActive);

    if (!activePlantId) {
        return res.status(500).json("No active plant found!");
    }
    const plant: PlantDocument = (await Plant.findOne({
        _id: activePlantId.plantId,
        isDeleted: false,
    })) as PlantDocument;

    if (!plant) {
        return res.status(500).json("Plant does not exist!");
    }

    return res.status(200).json(plant);

};
export const getPlants = async (req: Request, res: Response) => {

    const page = getPage(req);
    const pageSize = getPageSize(req);
    const userId = req.query.userId || undefined;
    const plantId = req.query.plantId || undefined;
    const isActive = req.query.isActive || undefined

    if (plantId) {
        const plant: PlantDocument = (await Plant.findOne({
            _id: plantId,
            isDeleted: false
        })) as PlantDocument;
        return res.status(200).json(plant);
    }

    if (!userId) {
        let plants: PlantDocument[] = (await Plant.find({
            isDeleted: false,
        }).skip(page * pageSize).limit(pageSize)) as PlantDocument[];

        return res.status(200).json(plants);
    }


    const user: UserDocument = (await User.findOne({
        _id: userId,
        isDeleted: false,
    })) as UserDocument;

    if (!user) {
        return res.status(500).json("User does not exist!");
    }

    const plants = user.plants.map((plant) => {
        if (isActive == "true") {
            if (plant.isActive) {
                return plant.plantId;
            }
        }
        else {
            return plant.plantId;
        }

    });


    const plantList: PlantDocument[] = (await Plant.find({
        _id: { $in: plants },
        isDeleted: false,
    }).skip(page * pageSize).limit(pageSize)) as PlantDocument[];

    if (!plantList) {
        return res.status(500).json("Plants do not exist!");
    }

    return res.status(200).json(plantList);

};

export const updatePlant = async (req: Request, res: Response) => {
    const user: UserDocument = req.user as UserDocument;

    await check("plantId", "plantId is not valid").isLength({ min: 1 }).run(req);
    await check("plantName", "plantName is not valid").isLength({ min: 1 }).run(req);
    await check("plantLocation", "plantLocation is not valid").isLength({ min: 1 }).run(req);

    const plant: PlantDocument = (await Plant.findOne({
        _id: req.body.plantId,
        isDeleted: false
    })) as PlantDocument;

    if (!plant) {
        return res.status(500).json("Plant does not exist!");
    }

    plant.plantName = req.body.plantName;
    plant.plantLocation = req.body.plantLocation;


    try {
        await plant.save();
        return res.json(plant);
    }
    catch (err) {
        return res.status(500).json({ err });
    }

};
export const deletePlant = async (req: Request, res: Response) => {

    let plantId = req.params.id;

    if(!plantId){
        return res.status(500).json("PlantId is not valid!");
    }

    const user: UserDocument = req.user as UserDocument;

    const plant: PlantDocument = (await Plant.findOne({
        _id: plantId,
        isDeleted: false
    })) as PlantDocument;

    if (!plant) {
        return res.status(500).json("Plant does not exist!");
    }

    plant.isDeleted = true;

    try {
        await plant.save();
        return res.status(200).json(plant);
    }
    catch (err) {
        return res.status(500).json({ err });
    }
}

const assignUsers = async (
    newPlant: any,
    departments: DepartmentDocument[],
    requestedAssignments: any[]
) => {
    return new Promise(async (resolve, reject) => {
        const assignments = requestedAssignments as {
            userId: string;
            departments: string[];
        }[];

        if (departments && departments.length > 0 && assignments && assignments.length > 0) {
            const assignedUsers = await Promise.all(
                assignments.map(async (assignment) => {
                    if (!mongoose.isValidObjectId(assignment.userId)) {
                        return reject("Invalid user id when assigning to plant.");
                    }

                    const assignedUser = await User.findOne({ _id: assignment.userId });

                    if (!assignedUser) {
                        return reject(
                            "Plant created successfully but user not found when assigning"
                        );
                    }

                    const assignedDepartments = departments.find(
                        (department: { departmentName: string }) =>
                            assignment.departments.includes(department.departmentName)
                    );

                    if (!assignedDepartments) {
                        return reject(
                            "Department not found when assigning to users. Please try again or contact support."
                        );
                    }

                    assignedUser.plants.push({
                        plantId: newPlant._id.valueOf(),
                        departments: assignedDepartments._id,
                        isActive: false,
                    });

                    await assignedUser.save();

                    return assignedUser;
                })
            );
            return resolve(
                "Plant created successfully and users assigned to plant and departments."
            );
        } else if (assignments && assignments.length > 0) {
            const assignedUsers = await Promise.all(
                assignments.map(async (assignment) => {
                    if (!mongoose.isValidObjectId(assignment.userId)) {
                        return reject("Invalid user id when assigning to plant.");
                    }
                    const assignedUser = await User.findOne({ _id: assignment.userId });

                    if (!assignedUser) {
                        return reject("User not found when assigning to plant.");
                    }

                    try {
                        assignedUser.plants.push({
                            plantId: newPlant._id.valueOf(),
                            departments: [""],
                            isActive: false,
                        });

                        await assignedUser.save();

                        return assignedUser;
                    } catch (err) {
                        return reject("Error while assigning users to plant. " + err);
                    }
                })
            );
            return resolve("Plant created successfully and users assigned to plant.");
        } else {
            resolve("Plant Created Successfully.");
        }
    });
};

const cancelPlantCreate = (
    plant: PlantDocument,
    departments: DepartmentDocument[]
) => {
    return new Promise(async (resolve, reject) => {
        try {
            await plant.remove();

            departments.forEach((department: { remove: () => any }) => {
                department.remove();
            });

            resolve("Plant creation cancelled successfully.");
        } catch (err) {
            reject("Error while cancelling plant creation. " + err);
        }
    });
};

