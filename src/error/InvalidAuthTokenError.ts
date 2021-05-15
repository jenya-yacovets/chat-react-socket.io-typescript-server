export class InvalidAuthTokenError extends Error {

    constructor(message: string = 'Invalid JWT token') {
        super(message);
        this.name = 'InvalidAuthTokenError'
    }
}
