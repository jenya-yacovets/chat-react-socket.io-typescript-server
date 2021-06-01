import {Middleware, ExpressErrorMiddlewareInterface, BadRequestError} from 'routing-controllers'
import { Response, NextFunction } from 'express'
import IResponseJson from "../type/IResponseJson"
import IModifiedRequest from "../type/IModifiedRequest"
import {Service} from "typedi"
import {HttpError} from "../error/http/HttpError"
import {NotFoundHttpError} from "../error/http/NotFoundHttpError";
import {BadRequestHttpError} from "../error/http/BadRequestHttpError";

@Middleware({ type: 'after' })
@Service()
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {

  error(error: HttpError, req: IModifiedRequest, res: Response, next: NextFunction): void {
    console.error('Error name: %s | Error message: %s', error.name, error.message)
    console.error(error)

    res.status(error.httpCode)
    let responseJson: IResponseJson = {
      success: false,
      error: error.message,
      requestId: req.id
    }

    if (error instanceof BadRequestHttpError || error instanceof BadRequestError) {
      responseJson.error = this.badRequestParse(error)
    } else if(error instanceof NotFoundHttpError) {
        return next()
    } else if(!error.message || !error.httpCode){
      res.status(500)
      responseJson.error = 'Server error'
    }

    res.json(responseJson)
  }

  private badRequestParse(error: HttpError): string {
    try {
      if(typeof error.errors === 'object') {

        let message = "Parameters passed incorrectly:"
        for (let i = 0; i<error.errors.length; i++) {
          const e = error.errors[i]
          message += ` ${e.property}`
          if(i < error.errors.length-1) message += ','
        }
        return message
      } else if (error.message) {
        return error.message
      } else {
        return "Bad request"
      }
    } catch(e) {
      return "Bad request"
    }
  }
}