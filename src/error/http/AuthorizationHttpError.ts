import {HttpError} from "./HttpError"

export class AuthorizationHttpError extends HttpError {

    constructor(message: string = 'Authorization error') {
        super( 401, "AuthorizationError", message)
    }
}
