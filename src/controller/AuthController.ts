import {Body, CookieParam, HttpCode, JsonController, Post, Req, Res} from 'routing-controllers'
import {Inject, Service} from "typedi"
import {Response} from "express"
import {IsNotEmpty, isUUID, Length} from "class-validator"

import {AuthService} from "../service"
import {User} from "../entity/User"
import IResponseJson from "../type/IResponseJson"
import IModifiedRequest from "../type/IModifiedRequest"
import {InvalidAuthTokenError} from "../error/InvalidAuthTokenError"
import {ServerHttpError} from "../error/http/ServerHttpError"
import {InvalidTokenHttpError} from "../error/http/InvalidTokenHttpError"
import {ConflictHttpError} from "../error/http/ConflictHttpError"
import {DuplicationDataError} from "../error/DuplicationDataError"
import {InvalidDataError} from "../error/InvalidDataError"
import { BadRequestHttpError } from '../error/http/BadRequestHttpError'

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
@JsonController('/secure')
export class AuthController {
    private readonly domain = process.env.DOMAIN

    @Inject()
    private authService!: AuthService

    @Post('/register')
    @HttpCode(201)
    async register(@Body() regUser: RegUser): Promise<IResponseJson> {

        const user = new User();
        user.login = regUser.login
        user.name = regUser.name
        user.password = regUser.password

        try {
            const userRegister = await this.authService.register(user)

            return {
                success: true,
                data: {
                    id: userRegister.id,
                    login: userRegister.login
                }
            }
        } catch(e) {
            if(e instanceof DuplicationDataError) throw new ConflictHttpError("Login is busy")
            throw new ServerHttpError()
        }
    }

    @Post('/authentication')
    async authentication(@Req() req: IModifiedRequest, @Res() res: Response, @Body() authUser: AuthUser): Promise<IResponseJson> {
        const user = new User()
        user.login = authUser.login
        user.password = authUser.password

        try {
            const { user: findUser, tokens } = await this.authService.authentication(user, req.useragent, req.clientIp)

            this.setRefreshCookie(req, res, tokens)

            return {
                success: true,
                data: {
                    id: findUser.id,
                    login: findUser.login,
                    accessToken: tokens.accessToken
                }
            }
        } catch (e) {
            if (e instanceof InvalidDataError) throw new BadRequestHttpError('Invalid login or password')
            throw new ServerHttpError()
        }
    }

    @Post('/refresh-token')
    async refreshToken(@Req() req: IModifiedRequest, @Res() res: Response, @CookieParam('refreshToken') token: string): Promise<IResponseJson> {

        if (!isUUID(token, 4)) throw new BadRequestHttpError('Invalid token')

        try {

            const tokens = await this.authService.refreshToken(token, req.useragent, req.ip)

            this.setRefreshCookie(req, res, tokens)

            return {
                success: true,
                data: {
                    accessToken: tokens.accessToken
                }
            }
        } catch (e) {
            if(e instanceof InvalidAuthTokenError) throw new InvalidTokenHttpError('Invalid refresh token')
            throw new ServerHttpError()
        }
    }

    private setRefreshCookie(req: IModifiedRequest, res: Response, tokens) {
        const pathCookie = req.route.path.split('/').slice(0, 3).join('/')

        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: tokens.expiresRefreshToken,
            httpOnly: true,
            domain: this.domain,
            secure: false,
            path: pathCookie
        })
    }
}

