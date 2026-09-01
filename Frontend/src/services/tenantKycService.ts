// import api from "./api";
// import type {
//   IKycUploadRequest,
//   IKycUploadResponse,
// } from "../types/kyc.types";
// import { API_ROUTES } from "../shared/apiRoutes";

// interface IApiResponse<T> {
//   success: boolean;
//   statusCode: number;
//   message: string;
//   data: T;
// }

// export interface ITenantKycService {
//   uploadKyc(
//     data: IKycUploadRequest
//   ): Promise<IKycUploadResponse>;
// }

// class TenantKycService implements ITenantKycService {
//   async uploadKyc(
//     data: IKycUploadRequest
//   ): Promise<IKycUploadResponse> {
//     const formData = new FormData();

//     formData.append(
//       "businessRegistrationCertificate",
//       data.businessRegistrationCertificate
//     );

//     formData.append(
//       "ownerIdProof",
//       data.ownerIdProof
//     );

//     const response =
//       await api.post<IApiResponse<IKycUploadResponse>>(
//         API_ROUTES.TENANTS.UPDATE_KYC,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//     return response.data.data;
//   }
// }

// export const tenantKycService = new TenantKycService();


import api from "./api";
import { API_ROUTES } from "../shared/apiRoutes";

export interface IPresignedUrlResponse {
  uploadUrl: string;
  objectKey: string;
}

export interface ITenantKycService {
  getPresignedUrl(fileName: string, contentType: string): Promise<IPresignedUrlResponse>;
  uploadFileToS3(uploadUrl: string, file: File): Promise<void>;
  uploadKyc(data: {
    businessRegistrationCertificateKey: string;
    ownerIdProofKey: string;
  }): Promise<any>;
  getPresignedViewUrl(objectKey: string): Promise<string>;
}

class TenantKycService implements ITenantKycService {
  async getPresignedUrl(fileName: string, contentType: string): Promise<IPresignedUrlResponse> {
    const response = await api.post<{ success: boolean; data: IPresignedUrlResponse }>(
      "/storage/presigned-url",
      { fileName, contentType }
    );
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
    const response = await api.post(
      API_ROUTES.TENANTS.UPDATE_KYC,
      data
    );
    return response.data.data;
  }

  async getPresignedViewUrl(objectKey: string): Promise<string> {
    const response = await api.post<{ success: boolean; data: { downloadUrl: string } }>(
      "/storage/presigned-download-url",
      { objectKey }
    );
    return response.data.data.downloadUrl;
  }
}

export const tenantKycService = new TenantKycService();