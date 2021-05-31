import { Request } from "express"
import IReqUserData from "./IReqUserData"

/**
 * Modified Request (Express) object
 */
export default interface IModifiedRequest extends Request {
    user: IReqUserData
    id: string
    clientIp: string
    useragent: object
}