import { UpdateBankDetailsDto } from "../../tenant/dto/UpdateBankDetailsDto";
import { Tenant } from "../../../domain/entities/Tenant";

export interface IUpdateBankDetailsUseCase {
    execute(tenantId: string, input: UpdateBankDetailsDto): Promise<Tenant>
}