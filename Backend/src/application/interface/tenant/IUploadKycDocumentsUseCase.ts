import { UploadKycDocumentsDto } from "../../tenant/dto/UploadKycDocumentsDto";
import { Tenant } from "../../../domain/entities/Tenant";

export interface IUploadKycDocumentsUseCase {
    execute(tenantId: string, input: UploadKycDocumentsDto): Promise<Tenant>
}