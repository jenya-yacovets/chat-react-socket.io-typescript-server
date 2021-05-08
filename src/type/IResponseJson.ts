export default interface IResponseJson {
    success: boolean
    requestId?: string
    error?: string
    data?: object
}