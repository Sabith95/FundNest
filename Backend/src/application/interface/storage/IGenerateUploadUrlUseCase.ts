import { UploadUrlResponse } from "../../../infrastructure/storage/interfaces/IS3StorageService";
import { GenerateUploadUrlDto } from "../../storage/Dto/GenerateUploadUrlDto";

export interface IGenerateUploadUrlUseCase {
  execute(
    dto: GenerateUploadUrlDto,
    tenantId: string,
  ): Promise<UploadUrlResponse>;
}
