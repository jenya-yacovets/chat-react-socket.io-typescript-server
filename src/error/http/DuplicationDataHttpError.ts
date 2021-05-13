import {HttpError} from "./HttpError";

export class DuplicationDataHttpError extends HttpError {

    constructor(message: string) {
        super(409, "DuplicationData", message);
    }
}
