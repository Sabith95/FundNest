import { Tenant } from "../../../domain/entities/Tenant";
import { VerifyBankDetailsDto } from "../../admin/dto/AdminVerificationDto";

export interface IVerifyBankDetailsUseCase {
  execute(tenantId: string, dto: VerifyBankDetailsDto): Promise<Tenant>;
}