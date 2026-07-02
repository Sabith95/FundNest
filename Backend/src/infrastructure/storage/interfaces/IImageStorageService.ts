export interface UploadImageInput {
    buffer: Buffer;
    filename: string;
    folder?: string;
}

export interface UploadImage{
    url: string; 
    publicId: string;
}

export interface IImageStorageService {
    uploadImage(input: UploadImageInput): Promise<UploadImage>;
    deleteImage(publicId: string): Promise<void>;
}