import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IGetAllUsersUseCase } from "../../interface/admin/IGetAllUserUseCase";
import { GetAllUsersRequestDto } from "../dto/GetAllUsersRequestDto";
import { TOKENS } from "../../../shared/tokens";
import { AdminUserResponseDtoMapper } from "../../mapper/AdminUserResponseDtoMapper";

@injectable()
export class GetAllUserUseCase implements IGetAllUsersUseCase {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(data: GetAllUsersRequestDto) {
    const page = data.page ?? 1;
    const limit = data.limit ?? 10;
    const search = data.search;

    const result = await this._userRepository.findPaginated(
      page,
      limit,
      search
    );



    return {
      users: AdminUserResponseDtoMapper.toDtoList(result.data),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}