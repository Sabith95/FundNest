import { injectable } from 'tsyringe'
import bcrypt from 'bcryptjs'
import { IBcryptService } from './interfaces/IBcryptService'

const SALT_ROUNDS = 12

@injectable()
export class BcryptService implements IBcryptService{

    async hashPassword(passWord: string): Promise<string> {
        return bcrypt.hash(passWord,SALT_ROUNDS)
    }

    async comparePassword(
        plainPassWord: string,
        hashedPassWord: string
    ): Promise<boolean> {
        return bcrypt.compare(plainPassWord, hashedPassWord)
    }
}


