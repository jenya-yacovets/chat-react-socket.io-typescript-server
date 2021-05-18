import {Inject, Service} from "typedi"
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'

import {User} from "../entity/User"
import {RedisConnection} from "../config/redisConnection"
import {promisify} from "util"
import {InvalidAuthTokenError} from "../error/InvalidAuthTokenError"

@Service()
export class TokenService {
    private readonly maxActiveSessionUser = Number(process.env.MAX_ACTIVE_USER_SESSION)
    private readonly jwtExpires = Number(process.env.ACCESS_JWT_EXPIRES)
    private readonly jwtSecret = process.env.ACCESS_JWT_SECRET
    private readonly refreshTokenExpires = Number(process.env.REFRESH_TOKEN_EXPIRES)

    @Inject()
    private redis!: RedisConnection

    public async getTokenAuth(user: User, fingerprint: string, ip: string): Promise<{refreshToken: string, accessToken: string, expiresRefreshToken: number}> {
        const tokenUserList = await this.redis.keysCustom(this.genKeyAllUser(user))

        const multi = this.redis.operation().multi()

        if(tokenUserList.length >= this.maxActiveSessionUser) await multi.del(...tokenUserList)

        const { refreshToken, accessToken } = await this.genTokenPair(user)

        const dataRedisSave = {
            userId: user.id,
            ip,
            fingerprint,
            createdAt: Date.now()
        }

        await multi.set(this.genKey(user, refreshToken), JSON.stringify(dataRedisSave), ['PX', this.refreshTokenExpires])

        await multi.exec()

        return {
            refreshToken,
            accessToken,
            expiresRefreshToken: this.refreshTokenExpires
        }
    }

    /*
        You can optimize it by writing a script in Lua
     */
    /**
     * @throws {InvalidAuthTokenError}
     *
     * @param oldToken
     * @param fingerprint
     * @param ip
     */
    public async getTokenRefresh(oldToken: string, fingerprint: string, ip: string) {
        const keyToken = await this.redis.keysCustom(this.genKeyToken(oldToken))
        if(keyToken.length > 1) {
            await this.redis.operation().del(...keyToken)
            throw new InvalidAuthTokenError()
        }
        if (keyToken.length < 1) throw new InvalidAuthTokenError()

        const dataOldTokenJson = await this.redis.operation().get(keyToken[0])
        await this.redis.operation().del(keyToken[0])
        let dataOldToken

        try {
            if(dataOldTokenJson) dataOldToken = JSON.parse(dataOldTokenJson)
        } catch (e) {}

        if(!dataOldToken) throw new InvalidAuthTokenError()
        if (dataOldToken.fingerprint != fingerprint) throw new InvalidAuthTokenError()

        const { refreshToken, accessToken } = await this.genTokenPair(dataOldToken.userId)

        const dataRedisSave = {
            userId: dataOldToken.userId,
            ip,
            fingerprint,
            createdAt: Date.now()
        }

        await this.redis.operation().set(this.genKey(dataOldToken.userId, refreshToken), JSON.stringify(dataRedisSave), ['PX', this.refreshTokenExpires])

        return {
            refreshToken,
            accessToken,
            expiresRefreshToken: this.refreshTokenExpires
        }
    }

    /**
     * @throws { InvalidAuthTokenError }
     * @param token
     */
    public async verification(token: string): Promise<{ id: number }> {
        try {
            return await promisify(jwt.verify)(token, this.jwtSecret)
        } catch(e) {
            throw new InvalidAuthTokenError()
        }
    }

    private genKeyAllUser(user: User | number): string {
        return `refresh_token:${typeof user === 'object' ? user.id : user}:*`
    }

    private genKeyToken(token: string): string {
        return `refresh_token:*:${token}`
    }

    private genKey(user: User | number, token: string): string {
        return `refresh_token:${typeof user === 'object' ? user.id : user}:${token}`
    }

    private async genTokenPair(user: User | number): Promise<{refreshToken: string, accessToken: string}> {
        const refreshToken = uuidv4()
        const accessToken = await promisify(jwt.sign)({
            id: typeof user === 'object' ? user.id : user
        }, this.jwtSecret, {
            algorithm: 'HS512',
            expiresIn: this.jwtExpires / 1000
        })
        return {
            refreshToken,
            accessToken
        }
    }

}
