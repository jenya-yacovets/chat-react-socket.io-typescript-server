import {Action} from "routing-controllers"
import {Container} from "typedi"

import {AuthService} from "../service"
import {AuthorizationHttpError} from "../error/http/AuthorizationHttpError"
import {InvalidAuthTokenError} from "../error/InvalidAuthTokenError"
import {DataNotFoundError} from "../error/DataNotFoundError"
import {ServerHttpError} from "../error/http/ServerHttpError"

export async function authorizationMiddleware({request}: Action, roles: string[]): Promise<boolean> {

    const authService = Container.get<AuthService>(AuthService)

    const { authorization: jwt } = request.headers

    if(!jwt) throw new AuthorizationHttpError()

    try {
        await authService.authorization(jwt)
        return true
    } catch(e) {
        if(e instanceof InvalidAuthTokenError || e instanceof DataNotFoundError) throw new AuthorizationHttpError()
    }
    throw new ServerHttpError()
}

