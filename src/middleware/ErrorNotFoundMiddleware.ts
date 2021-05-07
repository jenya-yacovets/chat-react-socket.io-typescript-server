import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers'
import { NextFunction, Request, Response } from 'express'
import RequestUser from '../interface/RequestAuth';

@Middleware({ type: 'after' })
export class ErrorNotFoundMiddleware implements ExpressMiddlewareInterface {

  public use(req: Request | RequestUser, res: Response, next?: NextFunction): void {
    if(!res.headersSent) {
      res.status(404)
      res.json({
        success: false,
        error: 'Method not found'
      })
    }
    res.end()
  }

}