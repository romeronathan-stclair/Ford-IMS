import { json, NextFunction, Request, Response } from "express";
import { Department, DepartmentDocument, Event, EventDocument, User, UserDocument } from "../models";
import { check } from "express-validator";
import { ModelType } from "../enums/modelType";
import { CrudType } from "../enums/crudType";
import { getPage, getPageSize } from "../utils/pagination";

//get Events

export const getEvents = async (req: Request, res: Response) => {
    const page = getPage(req);
    const pageSize = getPageSize(req);
    const plantId = req.body.plantId;
    const departmentId = req.body.departmentId;
    const user = req.body.user;
    const operation = req.body.operation;
    const date = req.body.date;

    if (plantId) {
        const event: EventDocument = (await Event.findOne({
            plantId: plantId
        })) as EventDocument;

        if (!event) {
            return res.status(500).json("No events found for this plant");
        }

        return res.json(event)
    } else if (departmentId) {
        const event: EventDocument = (await Event.findOne({
            departmentId: departmentId
        })) as EventDocument;

        if (!event) {
            return res.status(500).json("No events found for this department");
        }

        return res.json(event)
    } else if (user) {
        const events: EventDocument[] = (await Event.find({
            userId: user
        })) as EventDocument[];

        if (!events) {
            return res.status(500).json("No events found for this user");
        }

        return res.json(events)
    } else if (operation) {
        const events: EventDocument[] = (await Event.find({
            operationType: operation
        })) as EventDocument[];

        if (!events) {
            return res.status(500).json("No events found for this operation");
        }

        return res.json(events)
    } else if (date) {
        const events: EventDocument[] = (await Event.find({
            eventDate: date
        })) as EventDocument[];

        if (!events) {
            return res.status(500).json("No events found for this date");
        }

        return res.json(events)
    }

};
