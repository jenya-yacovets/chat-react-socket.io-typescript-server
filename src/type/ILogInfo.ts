import {User} from "../entity/User";

export interface ILogInfo {
    id: string
    user: User
    text: string
    data: object
}