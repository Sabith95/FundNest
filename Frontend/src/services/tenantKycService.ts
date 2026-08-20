import api from "./api";
import type {
  IKycUploadRequest,
  IKycUploadResponse,
} from "../types/kyc.types";
import { API_ROUTES } from "../shared/apiRoutes";

interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ITenantKycService {
  uploadKyc(
    data: IKycUploadRequest
  ): Promise<IKycUploadResponse>;
}

class TenantKycService implements ITenantKycService {
  async uploadKyc(
    data: IKycUploadRequest
  ): Promise<IKycUploadResponse> {
    const formData = new FormData();

    formData.append(
      "businessRegistrationCertificate",
      data.businessRegistrationCertificate
    );

    formData.append(
      "ownerIdProof",
      data.ownerIdProof
    );

    const response =
      await api.post<IApiResponse<IKycUploadResponse>>(
        API_ROUTES.TENANTS.UPDATE_KYC,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

    return response.data.data;
  }
}

export const tenantKycService = new TenantKycService();