export interface IBcryptService {
    hashPassword(passWord: string): Promise<string>
    comparePassword(
        plainPassWord: string,
        hashedPassWord: string
    ): Promise<boolean>
}