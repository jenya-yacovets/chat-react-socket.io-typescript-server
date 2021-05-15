import {HttpError} from "./HttpError"

export class BadRequestHttpError extends HttpError {

    constructor(message: string) {
        super(400, "BadRequest", message)
    }
}
