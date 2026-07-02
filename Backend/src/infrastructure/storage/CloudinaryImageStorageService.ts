import { injectable } from "tsyringe";
import {Readable} from 'stream'
import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../config/cloudinary";
import { env } from "../../config/env";
import { IImageStorageService, UploadImage, UploadImageInput } from "./interfaces/IImageStorageService";

@injectable()
export class CloudinaryImageStorageService implements IImageStorageService {
    async uploadImage(input: UploadImageInput): Promise<UploadImage> {
        
        const publicId = input.filename?.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-");

        const result = await new Promise<UploadApiResponse>((resolve,reject) =>{
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: input.folder ?? env.CLOUDINARY_FOLDER,
                    resource_type: 'image',
                    public_id: publicId,
                    overwrite: true,
                },
                (error,uploadResult) =>{
                    if(error || !uploadResult){
                        reject(error ?? new Error('Cloudinary upload failed'))
                        return
                    }

                    resolve(uploadResult)
                }
            )

            Readable.from(input.buffer).pipe(stream)
        })

        return {
            url: result.secure_url,
            publicId: result.public_id,
        }
    }

    async deleteImage(publicId: string): Promise<void> {
        if(!publicId) return

        await cloudinary.uploader.destroy(publicId, {
            invalidate: true,
            resource_type: "image",
        })
    }
}