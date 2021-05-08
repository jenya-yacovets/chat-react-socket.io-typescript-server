import {Body, JsonController, Post} from 'routing-controllers'
import {Service} from "typedi"
import {UserNoAuthService} from "../service"
import {IsNotEmpty, Length} from "class-validator"

class Register {
    @IsNotEmpty()
    @Length(5, 20)
    public login!: string

    @IsNotEmpty()
    @Length(5, 20)
    public name!: string

    @IsNotEmpty()
    @Length(8, 30)
    public password!: string
}
class Authentication {
    @IsNotEmpty()
    @Length(5, 20)
    public login!: string

    @IsNotEmpty()
    @Length(5, 20)
    public name!: string

    @IsNotEmpty()
    @Length(8, 30)
    public password!: string
}

@JsonController()
@Service()
export default class UserNoAuthController {

    constructor(private userNoAuthService: UserNoAuthService) {}

    @Post('/register')
    register(@Body() user: Register) {
        return this.userNoAuthService.register()
    }

    @Post('/authentication')
    authentication(@Body() auth: Authentication) {
        return this.userNoAuthService.authentication()
    }

}
