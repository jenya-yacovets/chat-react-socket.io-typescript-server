import { Request, Response } from 'express'
import { JsonController, Post, Req, Res } from 'routing-controllers'

@JsonController()
export default class UserNoAuth {

    @Post('/register')
    register(@Req() request: Request, @Res() response: Response) {
        return response.json({
            method: 'register'
        })
    }

    @Post('/authentication')
    authentication(@Req() request: Request, @Res() response: Response) {
        return response.json({
            method: 'authentication'
        })
    }

}
