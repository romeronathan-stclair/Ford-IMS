import { json, NextFunction, Request, Response } from "express";
import { Department, DepartmentDocument, Event, User, UserDocument } from "../models";
import { check, validationResult } from "express-validator";
import { ModelType } from "../enums/modelType";
import { CrudType } from "../enums/crudType";
import { getPage, getPageSize } from "../utils/pagination";
import { Types } from "mongoose";


//create Department
export const createDepartment = async (req: Request, res: Response) => {
    //check if inputs are valid
    await check("departmentName", "departmentName is not valid").isLength({ min: 1 }).run(req);
    await check("plantId", "plantId is not valid").isLength({ min: 1 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json(errors);
    }


    //check if Department already exists
    let response;
    const department: DepartmentDocument = (await Department.findOne({
        departmentName: req.body.departmentName,
        plantId: req.body.plantId,
        isDeleted: false
    })) as DepartmentDocument;

    //request User
    const user: UserDocument = req.user as UserDocument;


    if (department) {
        return res.status(500).json("Department already exists");
    }

    //create new Department
    const newDepartment: DepartmentDocument = new Department();
    newDepartment.departmentName = req.body.departmentName;
    newDepartment.plantId = req.body.plantId;
    newDepartment.isDeleted = false;

    //save new Department
    response = {
        department: newDepartment,
        message: "Department created successfully"
    }
    try {

        const userPlant = user.plants.find(p => p.plantId === newDepartment.plantId);
        if (!userPlant) {
            return res.status(500).json("User does not have access to this plant");
        }
        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id, "plants.plantId": newDepartment.plantId },
            { $addToSet: { "plants.$.departments": newDepartment._id } },
            { new: true }
        );




        await newDepartment.save();

        // create Event
        const event = new Event({
            plantId: newDepartment.plantId,
            departmentId: newDepartment._id.valueOf(),
            eventDate: new Date().toDateString(),
            userId: user._id.valueOf(),
            operationType: CrudType.CREATE,
            modelType: ModelType.DEPARTMENT,
            userName: user.name,
            userEmailAddress: user.email,
            itemId: newDepartment._id.valueOf()
        });

        await event.save();

        return res.status(200).json({
            message: "Department and event created successfully",
            department: newDepartment,
            event: event
        });
    } catch (err) {
        return res.status(500).json("Error creating Department");
    }

};

//get Departments
export const getDepartments = async (req: Request, res: Response) => {
    const page = getPage(req);
    const pageSize = getPageSize(req);
    const userId = req.query.userId;
    const plantId = req.query.plantId;
    const departmentId = req.query.departmentId;
    const departmentName = req.query.departmentName;
    const query: any = {
        isDeleted: false,
    }

    if (departmentId) {
        query["_id"] = departmentId;
        const department = await Department.findOne({ _id: departmentId, isDeleted: false });

        if (!department) {
            return res.status(500).json("Department does not exist");
        }
        return res.status(200).json(department);
    }


    if (plantId) {
        query["plantId"] = plantId;
    }



    if (departmentName) {
        query["departmentName"] = departmentName;
    }

    if (userId) {
        const user = await User.findOne({ _id: userId, isDeleted: false });
        if (!user) {
            return res.status(500).json("User does not exist");
        }

        const plant = user.plants.find(plant => {
            return plant.plantId == plantId;
        });

        if (!plant) {
            return res.status(500).json("Plant does not exist");
        }

        const departmentIds = plant.departments.map(department => {
            return new Types.ObjectId(department.toString())
        });
        query["_id"] = { $in: departmentIds };

    }


    if (departmentName) {
        query["departmentName"] = { $regex: departmentName, $options: "i" };
    }


    console.log(query);
    const departmentCount = await Department.countDocuments(query);
    const departments = await Department.find(query).skip(page * pageSize).limit(pageSize).exec();

    let response = {
        departments: departments,
        departmentCount: departmentCount
    }
    return res.status(200).json(response);

};



//update Department
export const updateDepartment = async (req: Request, res: Response) => {
    const user: UserDocument = req.user as UserDocument;

    await check("departmentId", "departmentId is not valid").isLength({ min: 1 }).run(req);
    await check("departmentName", "departmentName is not valid").isLength({ min: 1 }).run(req);

    //find Department
    const department: DepartmentDocument = (await Department.findOne({
        _id: req.body.departmentId,
        isDeleted: false
    })) as DepartmentDocument;

    if (!department) {
        return res.status(500).json("Department does not exists");
    }

    //update Department
    department.departmentName = req.body.departmentName;

    const event = new Event({
        plantId: department.plantId,
        departmentId: department._id.valueOf(),
        eventDate: new Date().toDateString(),
        userId: user._id.valueOf(),
        operationType: CrudType.UPDATE,
        modelType: ModelType.DEPARTMENT,
        userName: user.name,
        userEmailAddress: user.email,
        itemId: department._id.valueOf()
    });

    //save Department
    try {
        await department.save();
        await event.save();
        return res.status(200).json({
            message: "Department updated successfully.",
            department: department,
            event: event
        });
    }
    catch (err) {
        return res.status(500).json("Error updating Department");
    }

};

//delete Department
export const deleteDepartment = async (req: Request, res: Response) => {

    const departmentId = req.params.id;
    console.log(departmentId);

    if (!departmentId) {
        return res.status(500).json("Department Id is not valid");
    }

    const user = req.user as UserDocument;


    // find Department by Id
    const department: DepartmentDocument = (await Department.findOne({
        _id: departmentId,
        isDeleted: false,
    })) as DepartmentDocument;

    if (!department) {
        return res.status(500).json("Department not found");
    }

    // delete Department
    department.isDeleted = true;
    const event = new Event({
        plantId: department.plantId,
        departmentId: department._id.valueOf(),
        eventDate: new Date().toDateString(),
        userId: user._id.valueOf(),
        operationType: CrudType.DELETE,
        modelType: ModelType.DEPARTMENT,
        userName: user.name,
        userEmailAddress: user.email,
        itemId: department._id.valueOf()
    });

    // save Department
    try {
        await department.save();
        await event.save();
        return res.status(200).json("Department deleted successfully");
    } catch (err) {
        return res.status(500).json("Error deleting Department" + err);
    }
};


