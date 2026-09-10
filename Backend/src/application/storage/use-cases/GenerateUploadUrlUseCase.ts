import { inject, injectable } from "tsyringe";
import {
  IS3StorageService,
  UploadUrlResponse,
} from "../../../infrastructure/storage/interfaces/IS3StorageService";
import { TOKENS } from "../../../shared/tokens";
import { IGenerateUploadUrlUseCase } from "../../interface/storage/IGenerateUploadUrlUseCase";
import { GenerateUploadUrlDto } from "../Dto/GenerateUploadUrlDto";
import { BadRequestError } from "../../../shared/errors/BadRequestError";
import { MESSAGES } from "../../../shared/constants/messages";

@injectable()
export class GenerateUploadUrlUseCase implements IGenerateUploadUrlUseCase {
  private static readonly ALLOWED_CONTENT_TYPES = [
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];

  constructor(
    @inject(TOKENS.S3StorageService)
    private readonly _s3StorageService: IS3StorageService,
  ) {}

  async execute(
    dto: GenerateUploadUrlDto,
    tenantId: string,
  ): Promise<UploadUrlResponse> {
    const { fileName, contentType } = dto;

    if (!GenerateUploadUrlUseCase.ALLOWED_CONTENT_TYPES.includes(contentType)) {
      throw new BadRequestError(MESSAGES.FILE_UPLOAD.INVALID_TYPE);
    }

    // Backend controls the storage path
    const folder = `kyc/${tenantId}`;

    return this._s3StorageService.generateUploadUrl({
      fileName,
      contentType,
      folder,
    });
  }
}
