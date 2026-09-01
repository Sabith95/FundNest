import { Tenant } from "../../../domain/entities/Tenant";
import { VerifyBusinessDetailsDto } from "../../admin/dto/AdminVerificationDto";

export interface IVerifyBusinessDetailsUseCase {
  execute(tenantId: string, dto: VerifyBusinessDetailsDto): Promise<Tenant>;
}