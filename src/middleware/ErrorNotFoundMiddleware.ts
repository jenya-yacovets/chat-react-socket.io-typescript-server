import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers'
import { NextFunction, Response } from 'express'
import IModifiedRequest from "../type/IModifiedRequest";
import {Service} from "typedi";

@Middleware({ type: 'after' })
@Service()
export class ErrorNotFoundMiddleware implements ExpressMiddlewareInterface {

  public use(req: IModifiedRequest, res: Response, next?: NextFunction): void {

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