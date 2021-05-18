import {Authorized, Get, JsonController, Req} from 'routing-controllers'
import IModifiedRequest from '../type/IModifiedRequest'
import {UserService} from "../service"
import {Inject, Service} from "typedi"

@Service()
@Authorized()
@JsonController()
export class UserController {

    @Inject()
    private userService!: UserService

    @Get('/profile')
    getProfile(@Req() req: IModifiedRequest) {
        return this.userService.getProfile(req.user)
    }

}
