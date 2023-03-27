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
import mongoose, { Types } from "mongoose";
import { ModelType } from "../enums/modelType";

export const createPlant = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(req.body);
    await check("plantName", "plantName is not valid")
        .isLength({ min: 1 })
        .run(req);
    await check("plantLocation", "plantLocation is not valid")
        .isLength({ min: 1 })
        .run(req);


    let eventList: EventDocument[] = [];
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

        const event: EventDocument = new Event({
            modelType: ModelType.PLANT,
            plantId: newPlant._id.valueOf(),
            userId: user._id.valueOf(),
            operationType: CrudType.CREATE,
            userName: user.name,
            itemId: newPlant._id.valueOf(),
            userEmailAddress: user.email,
            eventDate: new Date().toDateString(),
        }) as EventDocument;

        eventList.push(event);



        await user.save();
    } catch (err) {
        return res.status(500).json({ err });
    }

    if (req.body.departments) {
        if (!Array.isArray(req.body.departments)) {
            newPlant.remove();
            return res.status(400).json("Departments must be an array");
        }

        // map the departments from the req.body, they are an array of strings
        const departmentNames = req.body.departments;


        const existingDepartments = await Department.find({
            departmentName: { $in: departmentNames },
        });


        try {
            departments = req.body.departments.map((department: any) => {
                const newDepartment: DepartmentDocument = new Department();
                newDepartment.departmentName = department;
                newDepartment.plantId = newPlant._id.valueOf();
                newDepartment.isDeleted = false;

                const event: EventDocument = new Event({
                    eventDate: new Date().toDateString(),
                    userId: user._id.valueOf(),
                    operationType: CrudType.CREATE,
                    modelType: ModelType.DEPARTMENT,
                    userName: user.name,
                    plantId: newPlant._id.valueOf(),
                    userEmailAddress: user.email,
                    itemId: newDepartment._id.valueOf(),
                }) as EventDocument;

                eventList.push(event);


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
            cancelPlantCreate(newPlant, departments, eventList);
            return res.status(500).json("Error while creating departments." + err);
        }

    }


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

            eventList.map((event: { save: () => any }) => {
                return event.save();
            })

            return res.status(200).json(response);
        })
        .catch((err) => {
            response = {
                plant: newPlant,
                message: err,
            };
            try {
                cancelPlantCreate(newPlant, departments, eventList);


                return res.status(500).json(err);
            } catch (err) {
                return res
                    .status(500)
                    .json("Error while creating plant and departments." + err);
            }
        });
};
export const getActivePlant = async (req: Request, res: Response) => {
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
    const plantName = req.query.plantName || undefined;
    const isActive = req.query.isActive || undefined

    if (plantId) {
        console.log(plantId);
        const plant: PlantDocument = (await Plant.findOne({
            _id: plantId.toString(),
            isDeleted: false,
        })) as PlantDocument;


        return res.status(200).json(plant);
    }
    if (plantName) {
        const plant: PlantDocument = (await Plant.findOne({
            plantName: plantName.toString(),
            isDeleted: false,
        })) as PlantDocument;

        return res.status(200).json(plant);
    }

    if (!userId) {
        let plantCount = (await Plant.find({
            isDeleted: false,
        }).countDocuments());

        let plants: PlantDocument[] = (await Plant.find({
        }).skip(page * pageSize).limit(pageSize)) as PlantDocument[];

        if (!plants) {
            return res.status(500).json("Plants do not exist!");
        }
        let response = {
            plants: plants,
            plantCount: plantCount
        }
        return res.status(200).json(response);
    }


    const user: UserDocument = (await User.findOne({
        _id: userId,
        isDeleted: false,
    })) as UserDocument;

    if (!user) {
        return res.status(500).json("User does not exist!");
    }

    const plants = user.plants.map((plant) => {
        return plant.plantId;
    });


    const plantList: PlantDocument[] = (await Plant.find({
        _id: { $in: plants },
        isDeleted: false,
    }).skip(page * pageSize).limit(pageSize)) as PlantDocument[];

    const plantCount = (await Plant.find({
        _id: { $in: plants },
        isDeleted: false,
    }).countDocuments());


    if (!plantList) {
        return res.status(500).json("Plants do not exist!");
    }
    let response = {
        plants: plantList,
        plantCount: plantCount
    }

    return res.status(200).json(response);

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
    const event: EventDocument = new Event({
        eventDate: new Date().toDateString(),
        userId: user._id.valueOf(),
        operationType: CrudType.UPDATE,
        modelType: ModelType.PLANT,
        userName: user.name,
        plantId: plant._id.valueOf(),
        userEmailAddress: user.email,
        itemId: plant._id.valueOf(),
    }) as EventDocument;

    console.log("HERE");
    try {
        await event.save();
        await plant.save();
        return res.json(plant);
    }
    catch (err) {
        return res.status(500).json({ err });
    }

};
export const deletePlant = async (req: Request, res: Response) => {

    let plantId = req.params.id;

    if (!plantId) {
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

    const event: EventDocument = new Event({
        eventDate: new Date().toDateString(),
        userId: user._id.valueOf(),
        operationType: CrudType.DELETE,
        modelType: ModelType.PLANT,
        userName: user.name,
        plantId: plant._id.valueOf(),
        userEmailAddress: user.email,
        itemId: plant._id.valueOf(),
    }) as EventDocument;

    try {
        await plant.save();
        await event.save();
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
                            "User not found when assigning."
                        );
                    }

                    const assignedDepartmentIds: [string] = departments
                        .filter((department) => assignment.departments.includes(department.departmentName))
                        .map((department) => department._id.toString()) as [string];

                    if (!assignedDepartmentIds) {
                        return reject("Department not found when assigning to users. Please try again or contact support.");
                    }

                    assignedUser.plants.push({
                        plantId: newPlant._id.valueOf(),
                        departments: assignedDepartmentIds,
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
    departments: DepartmentDocument[],
    events: EventDocument[]
) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (plant) {
                await plant.remove();
            }

            if (departments && departments.length > 0) {
                departments.forEach((department: { remove: () => any }) => {
                    department.remove();
                });

            }
            if (events && events.length > 0) {
                events.forEach((event: { remove: () => any }) => {
                    event.remove();
                });
            }

            resolve("Plant creation cancelled successfully.");
        } catch (err) {
            reject("Error while cancelling plant creation. " + err);
        }
    });
};


