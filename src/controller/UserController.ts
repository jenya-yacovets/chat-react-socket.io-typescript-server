import { JsonController, Post, Req, UseBefore } from 'routing-controllers'
import IModifiedRequest from '../type/IModifiedRequest'
import { CheckAuthorizationMiddleware } from '../middleware/CheckAuthorizationMiddleware'
import {UserService} from "../service"
import {Service} from "typedi"

@JsonController()
@Service()
@UseBefore(CheckAuthorizationMiddleware)
export default class UserController {

    constructor(private userService: UserService) {}

    @Post('/profile')
    getProfile(@Req() req: IModifiedRequest) {
        return this.userService.getProfile(req.user)
    }

}
