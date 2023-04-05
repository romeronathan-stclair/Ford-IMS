import { NextFunction, Request, Response } from "express";

import fs from 'fs';
import path from 'path';

import { ImageRequest } from '../type/imageRequest';
import { Plant } from "../models";
import env from "../utils/env";

type MimeTypes = 'image/png' | 'image/jpeg' | 'image/jpg';

interface MimeTypeMap {
    [key: string]: string;
    'image/png': 'png';
    'image/jpeg': 'jpg';
    'image/jpg': 'jpg';
}

const MIME_TYPE_MAP: MimeTypeMap = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
export const uploadImage = async (imageRequest: ImageRequest) => {

    return new Promise((resolve, reject) => {

        const image = imageRequest.image;

        const dirPath = getImagePath(imageRequest);

        // Check if the image is valid.
        if (imageRequest.oldImage && imageRequest.oldImage != env.app.apiUrl + "/public/default-image") {
            const publicPath = "public/";
            const imagePath = imageRequest.oldImage.split(publicPath)[1];
            const dirPath = path.join(__dirname, '..', '..', 'public', imagePath);
            // Delete the file if it exists
            if (fs.existsSync(dirPath)) {
                fs.unlinkSync(dirPath);
            }
        }

        // Move the uploaded image to our upload folder


        image.mv(dirPath, (err: any) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
        });


        return resolve(dirPath);
    });

}
export const imageUpload = async (req: Request, res: Response) => {

    const plantId = req.body.plantId;
    const departmentId = req.body.departmentId;
    const itemId = req.body.itemId;
    const modelType = req.body.modelType;

    if (req.files) {
        const image = req.files.file;

        const imageRequest: ImageRequest = {
            image,
            modelType,
            plantId,
            departmentId,
            itemId
        };
        uploadImage(imageRequest);
    }

    return res.status(200).json("Image upload success").end();
}
export const retrieveImage = async (req: Request, res: Response) => {

    console.log("retrieveImage");

    const plantId = req.params.plantId;
    const departmentId = req.params.departmentId;
    const item = req.params.item;
    const modelType = req.params.modelType;

    let dirPath = path.join(`images/${plantId}/${departmentId}/${modelType}/${item}`);

    // Check if the image exists
    if (!fs.existsSync("public/" + dirPath)) {
        dirPath = path.join(`default-image/default-image.png`);
        res.sendFile(dirPath, { root: 'public' });

    }
    else {
        res.sendFile(dirPath, { root: 'public' });
    }

    // 




}
export const retrieveDefaultImage = async (req: Request, res: Response) => {

    console.log("retrieveDefaultImage");

    const dirPath = path.join(`default-image/default-image.png`);
    res.sendFile(dirPath, { root: 'public' });


}
export const getImagePath = (imageRequest: ImageRequest) => {

    const ext = "." + MIME_TYPE_MAP[imageRequest.image.mimetype];

    const dirPath = path.join(`public/images/${imageRequest.plantId}/${imageRequest.departmentId}/${imageRequest.modelType}/`);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });

    }
    const imagePath = path.join(dirPath, imageRequest.itemId + ext);

    return imagePath;
}
