import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers'
import { Response } from 'express'
import IModifiedRequest from "../type/IModifiedRequest"
import {Service} from "typedi"

@Middleware({ type: 'after' })
@Service()
export class ErrorNotFoundMiddleware implements ExpressMiddlewareInterface {

  public use(req: IModifiedRequest, res: Response): void {

    if(!res.headersSent) {
      res.status(404)
      res.json({
        success: false,
        error: 'Method not found',
        requestId: req.id
      })
    }
    res.end()
  }
}