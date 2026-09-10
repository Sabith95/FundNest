import api from "./api";
import { API_ROUTES } from "../shared/apiRoutes";

export interface IPresignedUrlResponse {
  uploadUrl: string;
  objectKey: string;
}

export interface ITenantKycService {
  getPresignedUrl(
    fileName: string,
    contentType: string,
  ): Promise<IPresignedUrlResponse>;
  uploadFileToS3(uploadUrl: string, file: File): Promise<void>;
  uploadKyc(data: {
    businessRegistrationCertificateKey: string;
    ownerIdProofKey: string;
  }): Promise<any>;
  getPresignedViewUrl(objectKey: string): Promise<string>;
}

class TenantKycService implements ITenantKycService {
  async getPresignedUrl(
    fileName: string,
    contentType: string,
  ): Promise<IPresignedUrlResponse> {
    const response = await api.post<{
      success: boolean;
      data: IPresignedUrlResponse;
    }>("/storage/presigned-url", { fileName, contentType });
    return response.data.data;
  }

  async uploadFileToS3(uploadUrl: string, file: File): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload ${file.name} to S3`);
    }
  }

  async uploadKyc(data: {
    businessRegistrationCertificateKey: string;
    ownerIdProofKey: string;
  }): Promise<any> {
    const response = await api.post(API_ROUTES.TENANTS.UPDATE_KYC, data);
    return response.data.data;
  }

  async getPresignedViewUrl(objectKey: string): Promise<string> {
    const response = await api.post<{
      success: boolean;
      data: { downloadUrl: string };
    }>("/storage/presigned-download-url", { objectKey });
    return response.data.data.downloadUrl;
  }
}

export const tenantKycService = new TenantKycService();
