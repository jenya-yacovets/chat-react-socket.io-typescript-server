import { ExpressMiddlewareInterface, UnauthorizedError } from 'routing-controllers'
import { Response, NextFunction } from 'express'
import RequestUser from '../interface/RequestAuth'

export class CheckAuthorizationMiddleware implements ExpressMiddlewareInterface {
    use(req: RequestUser, res: Response, next: NextFunction): any {
        const { authorization } = req.headers

        if(authorization === 'jwt test') {
            req.user = {
                id: 1
            }
            next()
        } else {
            throw new UnauthorizedError()
        }
    }
}