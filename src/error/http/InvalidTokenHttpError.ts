import {HttpError} from "./HttpError"

export class InvalidTokenHttpError extends HttpError {

    constructor(message: string = 'Invalid token') {
        super(401, "InvalidTokenError", message)
    }
}
