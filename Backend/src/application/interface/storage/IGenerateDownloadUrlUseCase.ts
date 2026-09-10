export interface IGenerateDownloadUrlUseCase {
  execute(objectKey: string): Promise<{ downloadUrl: string }>;
}
