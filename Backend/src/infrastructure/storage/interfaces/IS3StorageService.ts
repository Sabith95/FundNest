export interface GenerateUploadUrlInput {
    fileName: string
    contentType: string
    folder: string
}

export interface UploadUrlResponse {
    uploadUrl: string
    objectKey: string
}

export interface IS3StorageService {
    generateUploadUrl(
        input: GenerateUploadUrlInput
    ): Promise<UploadUrlResponse> 

    generateDownloadUrl(objectKey: string): Promise<string>

    deleteFile(objectKey: string): Promise<void>
}