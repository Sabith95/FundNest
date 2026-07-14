import { BusinessType } from "../../../shared/constants/enums/BusinessType";

export interface UpdateBusinessInfoDto {
  businessType: BusinessType;
  registrationId: string;
  registeredBusinessAddress: string
}