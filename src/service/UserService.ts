import { Service } from 'typedi'
import IReqUserData from "../type/IReqUserData"

@Service()
export class UserService {

     async getProfile(user: IReqUserData): Promise<any> {
         return
     }

}