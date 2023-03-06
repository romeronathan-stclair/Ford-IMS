import { EmailEvent } from "../../enums/email";
import { CreateEmailProps, Email } from "../../type/Email";
import * as emailContent from "./emailContent";

export const createEmailConfig = (props: CreateEmailProps): Email => {
    switch (props.emailEvent) {
        case EmailEvent.new_user: {
            return emailContent.newUser(props.inviteCode!, props.adminName!);
        }
        case EmailEvent.product_low_forecast: {
            return emailContent.lowInventory(props.employeeName!, props.hyperlink!, props.departmentNames!);
        }
        default: {
            throw new Error("Not a valid email event");
        }
    }
};
