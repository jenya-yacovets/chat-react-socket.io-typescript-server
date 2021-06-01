import {Inject, Service} from "typedi"

import {RedisConnection} from "../config/RedisConnection"
import {User} from "../entity/User"
import {DataNotFoundError} from "../error/DataNotFoundError"
import {classToClass, deserialize, serialize} from "class-transformer"

@Service()
export class CacheService{
    private readonly cacheExpires = Number(process.env.CACHE_USER_EXPIRES)

    @Inject()
    private readonly redis!: RedisConnection

    public async save(user: User): Promise<User> {
        const data = serialize(user, {strategy: 'excludeAll'})
        await this.redis.connection.set(this.genRedisKey(user), data, ['PX', this.cacheExpires])
        return classToClass(user, {strategy: 'excludeAll'})
    }

    /**
     * @throws {DataNotFoundError}
     * @param id
     */
    public async getCacheOrDB(id: number): Promise<User> {
        let redisData: string | null = await this.redis.connection.get(this.genRedisKey(id))
        let user

        if(redisData) {
            user = deserialize(User, redisData)
        }

        if (!user) {
            user = await User.findOne(id, {
                relations: ['role']
            })

            if(!user) throw new DataNotFoundError('Not found user')

            user = await this.save(user)
        }
        return user
    }

    private genRedisKey(user: User | number): string {
        return `cache_user:${typeof user === 'number' ? user : user.id}`
    }
}
