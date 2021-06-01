import {Authorized, CurrentUser, Get, JsonController, Req} from 'routing-controllers'
import IModifiedRequest from '../type/IModifiedRequest'
import {UserService} from "../service"
import {Inject, Service} from "typedi"
import IResponseJson from "../type/IResponseJson"
import {User} from "../entity/User"

@Service()
@Authorized()
@JsonController()
export class UserController {

    @Inject()
    private userService!: UserService

    @Get('/profile')
    async getProfile(@CurrentUser() user: User): Promise<IResponseJson> {
        const getUser = await this.userService.getProfile(user);
        delete getUser.role

        return {
            success: true,
            data: getUser
        }
    }
}
