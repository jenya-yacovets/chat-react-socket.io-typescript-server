import { Middleware, ExpressErrorMiddlewareInterface, HttpError, NotFoundError } from 'routing-controllers';
import { Response, NextFunction } from 'express'
import IResponseJson from "../type/IResponseJson";
import IModifiedRequest from "../type/IModifiedRequest";
import {Service} from "typedi";

@Middleware({ type: 'after' })
@Service()
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {

  error(error: HttpError, req: IModifiedRequest, res: Response, next: NextFunction): void {
    console.error('Error name: %s | Error message: %s', error.name, error.message)
    console.error(error)

    let responseJson: IResponseJson = {
      success: false,
      error: error.message,
      requestId: req.id
    }

    if (error.name === 'UnauthorizedError') {
      res.status(401)
      responseJson.error = 'Unauthorized error'
    } else if (error.name === 'BadRequestError') {
      res.status(400)
      responseJson.error = 'Bad request error'
    } else {
      res.status(500)
      responseJson.error = 'Server error'
    }

    res.json(responseJson)
  }
}