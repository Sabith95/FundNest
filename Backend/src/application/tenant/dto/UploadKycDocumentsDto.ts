export interface UploadKycDocumentsDto {

    businessRegistrationCertificate: {
        buffer: Buffer;
        originalName: string;
        mimeType: string;
    };

    ownerIdProof: {
        buffer: Buffer;
        originalName: string;
        mimeType: string;
    };
}