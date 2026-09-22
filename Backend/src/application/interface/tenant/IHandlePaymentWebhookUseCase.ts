export interface IHandlePaymentWebhookUseCase {
  execute(rawBody: Buffer, signature: string | undefined): Promise<void>;
}
