import { Service } from 'typedi'
import IReqUserData from "../type/IReqUserData";
import IResponseJson from "../type/IResponseJson";

interface user {
    id: number
}
@Service()
export class UserService {

    getProfile(user: IReqUserData): IResponseJson {
        return {
            success: false,
            data: {
                id: user.id,
                login: user.login
            }
        }
    }

}