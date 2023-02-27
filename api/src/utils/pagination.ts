import { Request } from "express";

export const MAX_PAGE_SIZE = 5;

export const getPage = (req: Request) => {
    if (!req.params.page) return 0;

    const page = parseInt(req.params.page);

    return isNaN(page) ? 0 : page;
};
export const getPageSize = (req: Request) => {
    if (!req.params.pageSize) return MAX_PAGE_SIZE;

    const pageSize = parseInt(req.params.page);

    return isNaN(pageSize) ? MAX_PAGE_SIZE : pageSize;
};
