import { User, Invite, UserDocument, InviteDocument, Plant, Department } from "../models";
import { check, validationResult } from "express-validator";
import { Request, Response } from "express";
import { createRandomToken } from "../utils/randomGenerator";
import { Charset } from "../enums/charset";

export const sendInvite = async (req: Request, res: Response) => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("adminType", "adminType missing").isString().run(req);
    await check("plants", "plants missing").isArray().run(req);
    await check("plants.departments", "plants.departments missing").isArray().run(req);

    // Check thats plants exist
    const plants = req.body.plants;
    const departments = [];
    if (plants) {
        for (const p of plants) {
            const plant = await Plant.find({ _id: p.plantId, isDeleted: false });
            if (!plant) {
                return res.status(500).json("Plant being invited to does not exist.");
            }
            departments.push(p.departments);
        }
    }

    if(departments) {
        for (const d of departments) {
            const department = await Department.find({ _id: d, isDeleted: false });
            if (!department) {
                return res.status(500).json("Department being invited to does not exist.");
            }
        }
    }
  

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(500).json(errors);
    }

    const user = await User.findOne({ email: req.body.email });

    if (user) {
        return res.status(500).json("A user already exists with this email");
    }

    const invite = await Invite.findOne({ email: req.body.email });
    const currentDate: Date = new Date();
    if (invite && !invite.isDeleted && !invite.isUsed && invite.validUntilDate >= currentDate) {
        return res.status(500).json("Invite already pending");
    }


  
    const email: string = req.body.email;
    const adminType: string = req.body.role;
    const token: string = createRandomToken(6, Charset.NUMERIC);
    const validUntilDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

    const newInviteLink: InviteDocument = new Invite();
    newInviteLink.email = email;
    newInviteLink.token = token;
    newInviteLink.adminType = adminType;
    newInviteLink.validUntilDate = validUntilDate;
    newInviteLink.isDeleted = false;
 


    try {
        await newInviteLink.save();
        return res.json(newInviteLink);
    } catch (err) {
        return res.status(500).json({ err });
    }
};