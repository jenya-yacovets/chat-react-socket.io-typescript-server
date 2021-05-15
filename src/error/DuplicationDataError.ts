export class DuplicationDataError extends Error {

    constructor(message: string = 'Duplication data') {
        super(message)
        this.name = 'DuplicationDataError'
    }
}
