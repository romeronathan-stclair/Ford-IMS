import Queue from "bull";
import env from "../utils/env";
import { SendMailOptions } from "nodemailer";
import transporter from "../utils/mailer";

const emailQueue = new Queue("email");

emailQueue.process(async (job: any) => {
   
    const mailOptions: SendMailOptions = {
        to: job.data.to,
        from: `boilerplate Inventory ${env.mailer.senderEmail}`,
        subject: "",
        html: "",
    };

    await transporter.sendMail(mailOptions);
});

export const addToEmailQueue = async (props:any) => {
    emailQueue.add(props);
};
