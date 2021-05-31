import {HttpError} from "./HttpError"

export class NotFoundHttpError extends HttpError {

    constructor(message: string = 'Method not found') {
        super(400, "NotFound", message)
    }
}
