import {HttpError} from "./HttpError"

export class ConflictHttpError extends HttpError {

    constructor(message: string) {
        super(409, "ConflictError", message)
    }
}
