export class DataNotFoundError extends Error {

    constructor(message: string = 'Data not found') {
        super(message);
        this.name = 'DataNotFoundError'
    }
}
