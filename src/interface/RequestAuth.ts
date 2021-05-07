import { Request } from "express"

export default interface RequestUser extends Request {
    user: object
}