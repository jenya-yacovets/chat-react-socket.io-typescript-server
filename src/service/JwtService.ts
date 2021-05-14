import {Inject, Service} from "typedi"
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'

import {User} from "../entity/User"
import {RedisClient} from "../config/redisConnection";

@Service()
export class JwtService {
    private readonly maxActiveSessionUser = Number(process.env.MAX_ACTIVE_USER_SESSION)

    @Inject()
    private redis!: RedisClient

    public async tokenPair2(user: User) {
        const tokenUserList = await this.redis.keysCustom(`refreshToken:${user.id}:*`)

        const multi = this.redis.connect().multi()

        if(tokenUserList.length >= this.maxActiveSessionUser) await multi.del(...tokenUserList)

        await multi.exec()
    }

    private tokenPair(user: User) {
        const refreshToken = uuidv4()
        const accessToken = jwt.sign({ id: user.id }, '123', { algorithm: 'RS256'})
    }

}