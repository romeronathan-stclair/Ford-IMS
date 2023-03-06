import { emailTemplate } from "./emailTemplate";
import env from "../env";
import { Email } from "../../type/Email";



export const newUser = (inviteCode: String, adminName: string): Email => {
    return {
        subject: `Setup Your Ford IMS Account`,
        html: emailTemplate(
            "Hello",
            `
        You have been invited to the Ford IMS portal by ${adminName}.
        <br>
        <br>
        Click <a href="${env.client.url}/account/signup/${inviteCode}">here</a> to complete your account setup.
        <br>
        <br>
        Your invitation code is: <strong>${inviteCode}</strong>.
        <br>
        <br>
        Your invitation code will expire within seven (7) days.
        `
        ),
    };
};
export const lowInventory = (employeeName: String, hyperlink: String, departmentNames: String[]): Email => {

    return {
        subject: `Low Inventory Alert`,
        html: emailTemplate(
            "Hello",
            `
        
        <br>
        <br>
       Deparment(s) with unhealthy product forecasts: ${departmentNames}
        <br>
        <br>
        Click <a href="${hyperlink}">here</a> to view the ticket.
        `
        ),
    };
}
