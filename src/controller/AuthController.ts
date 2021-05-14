import {Body, HttpCode, JsonController, Post} from 'routing-controllers'
import {Inject, Service} from "typedi"
import {AuthService} from "../service"
import {IsNotEmpty, Length} from "class-validator"
import {User} from "../entity/User"
import IResponseJson from "../type/IResponseJson"

class AuthUser {
    @IsNotEmpty()
    @Length(5, 20)
    public login!: string

    @IsNotEmpty()
    @Length(8, 30)
    public password!: string
}

class RegUser extends AuthUser {
    @IsNotEmpty()
    @Length(5, 20)
    public name!: string
}

@Service()
@JsonController()
export class AuthController {

    @Inject()
    private userNoAuthService!: AuthService

    @Post('/register')
    @HttpCode(201)
    async register(@Body() regUser: RegUser): Promise<IResponseJson> {

        const user = new User();
        user.login = regUser.login
        user.name = regUser.name
        user.password = regUser.password

        const userRegister = await this.userNoAuthService.register(user);

        return {
            success: true,
            data: {
                id: userRegister.id,
                login: userRegister.login,
                createdAt: userRegister.created_at
            }
        }
    }

    @Post('/authentication')
    authentication(@Body() authUser: AuthUser) {
        const user = new User()
        user.login = authUser.login
        user.password = authUser.password

        return this.userNoAuthService.authentication(user)
    }

}
