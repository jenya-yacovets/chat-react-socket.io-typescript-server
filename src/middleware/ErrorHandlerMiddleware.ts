import { Middleware, ExpressErrorMiddlewareInterface, HttpError, NotFoundError } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express'

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {

  error(error: HttpError, req: Request, res: Response, next: NextFunction): void {
    console.error('Error name: %s | Error message: %s', error.name, error.message)
    console.error(error)

    if (error.name === 'UnauthorizedError') {
      res.json({
        success: false,
        error: 'Unauthorized error'
      })
    } else {
      res.json({
        success: false,
        error: 'Server error'
      })
    }
  }
}