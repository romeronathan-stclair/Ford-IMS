import nodemailer from "nodemailer";
import env from "./env";

const transporter = nodemailer.createTransport({
    service: env.mailer.service,
    auth: {
        user: env.mailer.username,
        pass: env.mailer.password,
    },
});

export default transporter;
