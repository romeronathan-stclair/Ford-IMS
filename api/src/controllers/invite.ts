import { User, Invite, UserDocument, InviteDocument, Plant, Department } from "../models";
import { check, validationResult } from "express-validator";
import { Request, Response } from "express";
import { createRandomToken } from "../utils/randomGenerator";
import { Charset } from "../enums/charset";
import { addToEmailQueue } from "../config/bull";
import { EmailEvent } from "../enums/email";
import { CreateEmailProps, BullEmailQueueProps } from "../type/Email";

export const sendInvite = async (req: Request, res: Response) => {
    await check("invites", "Invites are not valid").run(req);


    if (!req.body.invites) {
        return res.status(500).json("No invites found");
    }

    for (const invite of req.body.invites) {

        // Check thats plants exist
        const plants = invite.plants;

        const user = req.user as UserDocument;

        if (!user) {
            return res.status(500).json("User not found");
        }

        const departments: string[] = [];
        if (plants) {

            for (const p of plants) {
                console.log(p);
                // add only the departmentId to the array

                p.departments = p.departments.map((d: any) => d.departmentId);
                departments.push(...p.departments);
                const plant = await Plant.findOne({ _id: p.plantId, isDeleted: false });

                if (!plant) {

                    return res.status(500).json("Plant being invited to does not exist.");
                }

            }
        }

        if (departments) {
            for (const d of departments) {

                const department = await Department.findOne({ _id: d, isDeleted: false });
                if (!department) {
                    return res.status(500).json("Department being invited to does not exist.");
                }
            }
        }


        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(500).json(errors);
        }

        const existingUser = await User.findOne({ email: invite.email });

        if (existingUser) {
            return res.status(500).json("A user already exists with this email");
        }

        const existingInvite = await Invite.findOne({ email: invite.email });
        const currentDate: Date = new Date();
        if (existingInvite && !existingInvite.isDeleted && !existingInvite.isUsed && existingInvite.validUntilDate >= currentDate) {
            return res.status(500).json("Invite already pending");
        }



        const email: string = invite.email;
        const adminType: string = invite.adminType;
        const token: string = createRandomToken(6, Charset.NUMERIC);
        const validUntilDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

        const newInviteLink: InviteDocument = new Invite({
            email: email,
            token: token,
            adminType: adminType,
            validUntilDate: validUntilDate,
            isDeleted: false,
            isUsed: false,
            plants: plants
        });

        const createEmailProps: CreateEmailProps = {
            emailEvent: EmailEvent.new_user,
            adminName: user.name,
            inviteCode: token,
        };

        const bullQueuePropsClient: BullEmailQueueProps = {
            emailProps: createEmailProps,
            to: email,
        };
        addToEmailQueue(bullQueuePropsClient);




        try {
            await newInviteLink.save();

        } catch (err) {
            return res.status(500).json({ err });
        }
    }

    return res.status(200).json("Invite sent");
};

