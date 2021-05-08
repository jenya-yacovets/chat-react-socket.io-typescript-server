import { ExpressMiddlewareInterface, UnauthorizedError } from 'routing-controllers'
import { Response, NextFunction } from 'express'
import RequestUser from '../type/IModifiedRequest'
import {Service} from "typedi";

@Service()
export class CheckAuthorizationMiddleware implements ExpressMiddlewareInterface {
    use(req: RequestUser, res: Response, next: NextFunction): any {
        const { authorization } = req.headers

        if(authorization === 'jwt test') {
            req.user = {
                id: 1,
                login: "Adam"
            }
            next()
        } else {
            throw new UnauthorizedError()
        }
    }
}