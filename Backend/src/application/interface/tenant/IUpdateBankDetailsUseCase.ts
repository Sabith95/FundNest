import { UpdateBankDetailsDto } from "../../tenant/dto/UpdateBankDetailsDto";
import { UpdateBankDetailsResponseDto } from "../../tenant/dto/UpdateBankDetailsResponseDto";

export interface IUpdateBankDetailsUseCase {
    execute(tenantId: string, input: UpdateBankDetailsDto): Promise<UpdateBankDetailsResponseDto>
}