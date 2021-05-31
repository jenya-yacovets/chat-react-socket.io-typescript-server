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
    async getProfile(@Req() req: IModifiedRequest, @CurrentUser() user: User): Promise<IResponseJson> {
        const profile = await this.userService.getProfile(user);
        return {
            success: true,
            data: profile
        }
    }
}
