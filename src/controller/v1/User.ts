import { Response } from 'express'
import { JsonController, Post, Req, Res, UseBefore } from 'routing-controllers'
import RequestUser from '../../interface/RequestAuth'
import { CheckAuthorizationMiddleware } from '../../middleware/CheckAuthorizationMiddleware'

@JsonController()
@UseBefore(CheckAuthorizationMiddleware)
export default class User {

    @Post('/profile')
    getData(@Req() request: RequestUser, @Res() response: Response) {
        return response.json(request.user)
    }

}
