import { Request } from "express";

export const MAX_PAGE_SIZE = Number.MAX_SAFE_INTEGER;

export const getPage = (req: Request) => {
    if (!req.params.page && !req.query.page) return 0;

    const page = parseInt(req.params.page ?? req.query.page?.toString());


    return isNaN(page) ? 0 : page;
};
export const getPageSize = (req: Request) => {
    if (!req.params.pageSize && !req.query.pageSize) return MAX_PAGE_SIZE;

    const pageSize = parseInt(req.params.pageSize ?? req.query.pageSize?.toString());

    return isNaN(pageSize) ? MAX_PAGE_SIZE : pageSize;
};
