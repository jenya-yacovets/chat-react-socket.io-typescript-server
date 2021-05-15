import {HttpError} from "./HttpError"

export class ServerHttpError extends HttpError {

    constructor(message: string = 'Server error') {
        super(500, "ServerError", message);
    }
}
