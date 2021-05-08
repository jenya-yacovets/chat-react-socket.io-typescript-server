import { Service } from 'typedi'

@Service()
export class UserNoAuthService {

    register() {
        return {
            ok: true
        }
    }

    authentication() {
        return {
            ok: true
        }
    }

}