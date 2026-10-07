import { AdminBillingRecordDto } from "../../../admin/subscription/dto/AdminBillingHistoryDto";

export interface IGetAdminBillingHistoryUseCase {
  execute(): Promise<AdminBillingRecordDto[]>;
}
