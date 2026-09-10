import { inject, injectable } from "tsyringe";
import { IS3StorageService } from "../../../infrastructure/storage/interfaces/IS3StorageService";
import { TOKENS } from "../../../shared/tokens";
import { IGenerateDownloadUrlUseCase } from "../../interface/storage/IGenerateDownloadUrlUseCase";
import { BadRequestError } from "../../../shared/errors/BadRequestError";
import { MESSAGES } from "../../../shared/constants/messages";

@injectable()
export class GenerateDownloadUrlUseCase implements IGenerateDownloadUrlUseCase {
  constructor(
    @inject(TOKENS.S3StorageService)
    private readonly _s3StorageService: IS3StorageService,
  ) {}
  async execute(objectKey: string): Promise<{ downloadUrl: string }> {
    if (!objectKey) {
      throw new BadRequestError(MESSAGES.STORAGE.OBJECT_KEY_REQUIRED);
    }
    const downloadUrl =
      await this._s3StorageService.generateDownloadUrl(objectKey);
    return { downloadUrl };
  }
}
