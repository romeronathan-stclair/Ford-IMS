import Queue from "bull";
import env from "../utils/env";
import { SendMailOptions } from "nodemailer";
import transporter from "../utils/mailer";
import { Email } from "../type/Email";
import { createEmailConfig } from "../utils/emails/emailConfig";

const emailQueue = new Queue("email");

emailQueue.process(async (job: any) => {
    const email: Email = createEmailConfig(job.data.emailProps);

    const mailOptions: SendMailOptions = {
        to: job.data.to,
        from: `Ford IMS Team ${env.mailer.senderEmail}`,
        subject: email.subject,
        html: email.html,
    };

    await transporter.sendMail(mailOptions);
});

export const addToEmailQueue = async (props: any) => {
    emailQueue.add(props);
};
