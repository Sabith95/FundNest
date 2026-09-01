import { Tenant } from "../../../domain/entities/Tenant";
import { VerifyKycDocumentsDto } from "../../admin/dto/AdminVerificationDto";

export interface IVerifyKycDocumentsUseCase {
  execute(tenantId: string, dto: VerifyKycDocumentsDto): Promise<Tenant>;
}