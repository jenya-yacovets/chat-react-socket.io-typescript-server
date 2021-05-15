import {Inject, Service} from "typedi"

import {RedisConnection} from "../config/redisConnection"
import {User} from "../entity/User"
import {ICacheUser} from "../type/ICacheUser"
import {DataNotFoundError} from "../error/DataNotFoundError"

@Service()
export class CacheService{
    private readonly cacheExpires = Number(process.env.CACHE_USER_EXPIRES)

    @Inject()
    private readonly redis!: RedisConnection

    public async save(user: User): Promise<ICacheUser> {
        const data: ICacheUser = {
            id: user.id,
            login: user.login,
            name: user.name,
            role: user.role
        }
        await this.redis.operation().set(this.genRedisKey(user), JSON.stringify(data), ['PX', this.cacheExpires])
        return data
    }

    /**
     * @throws {DataNotFoundError}
     * @param id
     */
    public async getCacheOrDB(id: number): Promise<User> {
        let redisData: string | null = await this.redis.operation().get(this.genRedisKey(id))
        let user

        try {
            if (redisData) user = <User> JSON.parse(redisData)
        } catch (e) {}

        if (!user) {
            user = await User.findOne(id)

            if(!user) throw new DataNotFoundError('Not found user')

            user = await this.save(user)
        }

        return user
    }

    private genRedisKey(user: User | number): string {
        return `cache_user:${typeof user === 'number' ? user : user.id}`
    }
}