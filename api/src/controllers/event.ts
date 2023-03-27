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
  const plantId = req.query.plantId;
  const departmentId = req.query.departmentId;
  const userId = req.query.userId;
  const operationType = req.query.operationType;
  const modelType = req.query.modelType;
  const date = req.query.eventDate;
  const query: any = {
    isDeleted: false,
  };

  if (plantId) {
    query["plantId"] = plantId;
    console.log(plantId)
  }

  if (departmentId) {
    query["departmentId"] = departmentId;
    console.log(departmentId)
  }

  if (userId) {
    query["userId"] = userId;
    console.log(userId);
  }

  if (operationType) {
    let word = operationType.toString();
    query["operationType"] = word.charAt(0).toUpperCase() + word.slice(1)
  }

  if (modelType) {
    let word = modelType.toString();
    query["modelType"] = word.charAt(0).toUpperCase() + word.slice(1);
  }

  if (date) {
    query["eventDate"] = date;
    console.log(date);
  }

  const events = await Event.find(query).skip(page * pageSize).limit(pageSize).exec();

  if (!events || events.length === 0) {
    return res.status(500).json("No events found");
  }

  return res.json(events);
};

