import { HttpError } from 'routing-controllers'

export class InvalidAuthData extends HttpError {
    constructor() {
        super(400, 'Invalid authentication data')
    }
}