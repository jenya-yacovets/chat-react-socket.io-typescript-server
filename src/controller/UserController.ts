import { JsonController, Post, Req, UseBefore } from 'routing-controllers'
import IModifiedRequest from '../type/IModifiedRequest'
import { CheckAuthorizationMiddleware } from '../middleware/CheckAuthorizationMiddleware'
import {UserService} from "../service"
import {Inject, Service} from "typedi"

@JsonController()
@Service()
@UseBefore(CheckAuthorizationMiddleware)
export class UserController {

    @Inject()
    private userService!: UserService

    @Post('/profile')
    getProfile(@Req() req: IModifiedRequest) {
        return this.userService.getProfile(req.user)
    }

}
