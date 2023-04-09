import { EmailEvent } from "../enums/email";


export type Email = {
    subject: string;
    html: string;
};

export type CreateEmailProps = {
    emailEvent: EmailEvent;
    employeeName?: string;
    ticketNumber?: string;
    timeRange?: string;
    hyperlink?: string;
    inviteCode?: string;
    departmentNames?: string[];
    adminName?: string;
};

export type BullEmailQueueProps = {
    emailProps: CreateEmailProps;
    to: string[] | string;
    toAllDepartmentMembers?: boolean;
};
