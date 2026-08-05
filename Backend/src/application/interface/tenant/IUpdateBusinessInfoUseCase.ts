import { Tenant } from "../../../domain/entities/Tenant";
import { UpdateBusinessInfoDto } from "../../tenant/dto/UpdateBusinessInfoDto";

export interface IUpdateBusinessInfoUseCase {
    execute(tenantId: string, input: UpdateBusinessInfoDto): Promise<Tenant>
}