import { json, NextFunction, Request, Response } from "express";
import { Department, DepartmentDocument, Event, User, UserDocument } from "../models";
import { check } from "express-validator";
import { ModelType } from "../enums/modelType";
import { CrudType } from "../enums/crudType";
import { getPage, getPageSize } from "../utils/pagination";


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

//get Department by Id
export const getDepartmentById = async (req: Request, res: Response) => {
    await check("departmentId", "departmentId is not valid").isLength({min: 1}).run(req);

    //find Department
    const department: DepartmentDocument = (await Department.findOne({
        _id: req.body.departmentId,
        isDeleted: false
    })) as DepartmentDocument;

    if (!department) {
        return res.status(500).json("Department does not exists");
    }

    return res.json(department);
};

//get all Departments
export const getAllDepartments = async (req: Request, res: Response) => {
    const page = getPage(req);
    const pageSize = getPageSize(req);

    const departments = await Department.find({ isDeleted: false}).skip(page * pageSize).limit(pageSize).exec();

    if (!departments) {
        return res.status(500).json("No Departments found");
    }

    return res.json(departments);
};

//get departments by User
export const getDepartmentsByUser = async (req: Request, res: Response) => {
    const user: UserDocument = req.user as UserDocument;

    const userDepartmentIds = user.plants.map((plant) => {
        return plant.departments;
    });

    const page = getPage(req);
    const pageSize = getPageSize(req);

    const departments = await Department.find({ _id: { $in: userDepartmentIds }, isDeleted: false}).skip(page * pageSize).limit(pageSize).exec();

    if (!departments) {
        return res.status(500).json("No Departments found");
    }

    return res.json(departments);
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
