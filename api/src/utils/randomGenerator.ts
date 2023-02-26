import randomString from "randomstring";
import { Charset } from "../enums/charset";

export const createRandomToken = (n: number, charset: Charset): string => {
    return randomString.generate({
        length: n,
        charset: charset,
    });
};
