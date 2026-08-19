import { UploadKycDocumentsDto } from "../../tenant/dto/UploadKycDocumentsDto";
import { UploadKycDocumentsResponseDto } from "../../tenant/dto/UploadKycDocumentsResponseDto";

export interface IUploadKycDocumentsUseCase {
    execute(tenantId: string, input: UploadKycDocumentsDto): Promise<UploadKycDocumentsResponseDto>
}