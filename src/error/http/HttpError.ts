export class HttpError extends Error {
    readonly httpCode: number
    errors: any;

    constructor(httpCode: number, name: string, message: string) {
        super(message);
        this.httpCode = httpCode
        this.name = name
    }
}
