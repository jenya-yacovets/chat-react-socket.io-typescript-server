import {Inject, Service} from 'typedi'
import {User} from "../entity/User"
import {DuplicationDataHttpError} from "../error/http/DuplicationDataHttpError"
import {BadRequestError} from "routing-controllers"
import {JwtService} from "./JwtService";

@Service()
export class AuthService {

    @Inject()
    private jwtService!: JwtService

    /**
     * @throws {DuplicationDataHttpError}
     */
    async register(user: User): Promise<User> {

        const findUserByLogin = await User.findOne({
            login: user.login
        })
        if(findUserByLogin) {
            throw new DuplicationDataHttpError("Login is busy")
        }
        return user.save();
    }

    /**
     * @throws {BadRequestError}
     */
    async authentication(user: User): Promise<User> {
        const findUserByLogin = await User.findOne({
            login: user.login
        })

        if(!findUserByLogin) throw new BadRequestError('Invalid login or password')
        this.jwtService.tokenPair2(findUserByLogin)
        const verifyPassword = await findUserByLogin.verifyPassword(user.password)

        if(!verifyPassword) throw new BadRequestError('Invalid login or password')

        return findUserByLogin
    }

}
