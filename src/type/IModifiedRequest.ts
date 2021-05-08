import { Request } from "express"
import IReqUserData from "./IReqUserData";

export default interface IModifiedRequest extends Request {
    user: IReqUserData
    id: string
}