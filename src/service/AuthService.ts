import {Inject, Service} from 'typedi'
import { createHash } from 'crypto'

import {User} from "../entity/User"
import {TokenService} from "./TokenService"
import {DataNotFoundError} from "../error/DataNotFoundError"
import {CacheService} from "./CacheService"
import {DuplicationDataError} from "../error/DuplicationDataError"
import {InvalidDataError} from "../error/InvalidDataError"

@Service()
export class AuthService {

    @Inject()
    private tokenService!: TokenService

    @Inject()
    private cacheService!: CacheService

    /**
     * @throws {DuplicationDataError}
     */
    async register(user: User): Promise<User> {

        const findUserByLogin = await User.findOne({
            login: user.login
        })
        if(findUserByLogin) throw new DuplicationDataError("Login is busy")
        return user.save()
    }

    /**
     * @throws {InvalidDataError}
     */
    async authentication(user: User, fingerprint: string | object, ip: string): Promise<{user: User, tokens: {refreshToken: string, accessToken: string, expiresRefreshToken: number}}> {
        const findUserByLogin = await User.findOne({
            login: user.login
        }, {
            relations: ['role']
        })

        if(!findUserByLogin) throw new InvalidDataError('Invalid login or password')

        const verifyPassword = await findUserByLogin.verifyPassword(user.password)

        if(!verifyPassword) throw new InvalidDataError('Invalid login or password')

        if(typeof fingerprint === 'object') fingerprint = this.genFingerprint(fingerprint)

        const tokens = await this.tokenService.getTokenAuth(findUserByLogin, fingerprint, ip)

        await this.cacheService.save(findUserByLogin)

        return {
            user: findUserByLogin,
            tokens
        }
    }

    /**
     * @throws {InvalidAuthTokenError, DataNotFoundError}
     * @param token
     */
    async authorization(token: string): Promise<User> {

        const {id} = await this.tokenService.verification(token)

        const findUserCache = await this.cacheService.getCacheOrDB(id)

        return findUserCache
    }

    /**
     * @throws {InvalidAuthTokenError}
     * @param token
     * @param fingerprint
     * @param ip
     */
    async refreshToken(token: string, fingerprint: string | object, ip: string): Promise<{refreshToken: string, accessToken: string, expiresRefreshToken: number}> {
        return await this.tokenService.getTokenRefresh(token, this.genFingerprint(fingerprint), ip)
    }

    private genFingerprint(userAgent): string {
        let str = userAgent.source
        return createHash("sha256").update(str).digest("hex")
    }
}
