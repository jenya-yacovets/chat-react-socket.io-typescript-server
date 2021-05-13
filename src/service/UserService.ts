import { Service } from 'typedi'
import IReqUserData from "../type/IReqUserData";
import IResponseJson from "../type/IResponseJson";

@Service()
export class UserService {

     async getProfile(user: IReqUserData): Promise<IResponseJson> {

         return {
             success: false,
             data: {
                 id: user.id,
                 login: user.login
             }
         }
     }

}