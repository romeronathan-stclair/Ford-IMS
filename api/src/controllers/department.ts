import { json, NextFunction, Request, Response } from "express";
import { Department, DepartmentDocument, Event, User, UserDocument } from "../models";
import { check } from "express-validator";
import { ModelType } from "../enums/modelType";
import { CrudType } from "../enums/crudType";
import { getPage, getPageSize } from "../utils/pagination";
import { Types } from "mongoose";


//create Department
export const createDepartment = async (req: Request, res: Response) => {
    //check if inputs are valid
    await check("departmentName", "departmentName is not valid").isLength({min: 1}).run(req);
    await check("plantId", "plantId is not valid").isLength({min: 1}).run(req);

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

    //create Event
    // const event = new Event({
    //     userId: user._id.valueOf(),
    //     userEmailAddress: user.email,
    //     operationType: CrudType.CREATE,
    //     model: ModelType.DEPARTMENT,
    //     modelId: newDepartment._id.valueOf(),
    // });

    //save new Department
    response = {
        department: newDepartment,
        message: "Department created successfully"
    }
    try {
        await newDepartment.save();
        // await event.save();
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json("Error creating Department");
    }

};

//get Departments
export const getDepartments = async (req: Request, res: Response) => {
    const page = getPage(req);
    const pageSize = getPageSize(req);
    const userId = req.params.userId;
    console.log(JSON.stringify(req.params));

    let user: UserDocument;
    User.findOne({ _id: userId }, async (err: NativeError, existingUser: UserDocument) => {
        if (err) {
            return res.status(500).json("Error finding user");
        }
        if (!existingUser) {
            return res.status(500).json("User does not exist");
        }
        user = existingUser;

        const plantId = req.params.plantId;
        const departmentId = req.params.departmentId;
        const plant = user.plants.find(plant => plant.plantId === plantId);

        if (!plant) {
            return res.status(500).json("Plant does not exist");
        }

        const departmentIds = plant.departments.map(department => department).flat();
        const userDepartmentIds = departmentIds.map(id => { 
            
            if (!departmentId) {
                return new Types.ObjectId(id.toString());
            } else if (departmentId === id.toString()) {
                return new Types.ObjectId(id.toString());
            } else {
                return null;
            }
        });

        const query = { 
            isDeleted: false,
            plantId: plantId,
            _id: { $in: userDepartmentIds }
        }

        const departments = await Department.find(query).skip(page * pageSize).limit(pageSize).exec();

        console.log(JSON.stringify(query));

        return res.status(200).json(departments);
    });
  
    
  };
  


//update Department
export const updateDepartment = async (req: Request, res: Response) => {
    const user: UserDocument = req.user as UserDocument;

    await check("departmentId", "departmentId is not valid").isLength({min: 1}).run(req);
    await check("departmentName", "departmentName is not valid").isLength({min: 1}).run(req);
    await check("plantId", "plantId is not valid").isLength({min: 1}).run(req);

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
    department.plantId = req.body.plantId;

    //create Event
    // const event = new Event({
    //     userId: user._id.valueOf(),
    //     userEmailAddress: user.email,
    //     operationType: CrudType.UPDATE,
    //     model: ModelType.DEPARTMENT,
    //     modelId: department._id.valueOf(),
    // });

    //save Department
    try {
        await department.save();
        // await event.save();
        return res.status(200).json("Department updated and Event Created");
    }
    catch (err) {
        return res.status(500).json("Error updating Department");
    }

};

//delete Department
export const deleteDepartment = async (req: Request, res: Response) => {
    const user: UserDocument = req.user as UserDocument;

    await check("departmentId", "departmentId is not valid").isLength({min: 1}).run(req);

    //find Department
    const department: DepartmentDocument = (await Department.findOne({
        _id: req.body.departmentId,
        isDeleted: false
    })) as DepartmentDocument;

    if (!department) {
        return res.status(500).json("Department does not exists");
    }

    //delete Department
    department.isDeleted = true;
    
    //create Event
    // const event = new Event({
    //     userId: user._id.valueOf(),
    //     userEmailAddress: user.email,
    //     operationType: CrudType.DELETE,
    //     model: ModelType.DEPARTMENT,
    //     modelId: department._id.valueOf(),
    // });

    //save Department Status
    try {
        await department.save();
        // await event.save();
        return res.status(200).json("Department deleted and Event Created");
    }
    catch (err) {
        return res.status(500).json("Error deleting Department");
    }

};
