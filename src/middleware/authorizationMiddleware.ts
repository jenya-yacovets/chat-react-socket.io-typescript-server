import {Action} from "routing-controllers"
import {Container} from "typedi"

import {AuthService} from "../service"
import {AuthorizationHttpError} from "../error/http/AuthorizationHttpError"
import {InvalidAuthTokenError} from "../error/InvalidAuthTokenError"
import {DataNotFoundError} from "../error/DataNotFoundError"
import {NotFoundHttpError} from "../error/http/NotFoundHttpError"

export async function authorizationMiddleware({request}: Action, roles: string[] | string): Promise<boolean> {

    const authService = Container.get<AuthService>(AuthService)

    const { authorization: jwt } = request.headers

    if(!jwt) throw new AuthorizationHttpError()

    try {
        request.user = await authService.authorization(jwt)
    } catch(e) {
        if(e instanceof InvalidAuthTokenError || e instanceof DataNotFoundError) throw new AuthorizationHttpError()
        throw e
    }

    if(roles.length > 0) {
        if (!roles.includes(request.user.role.name)) {
            throw new NotFoundHttpError();
        }
    }

    return true
}

