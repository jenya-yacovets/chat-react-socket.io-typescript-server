import redis, {RedisClient} from 'redis'
import {createNodeRedisClient, WrappedNodeRedisClient} from 'handy-redis'
import {Inject, Service} from 'typedi'
import {LoggerService} from '../service/LoggerService'

@Service({eager: true})
export class RedisConnection {
    private readonly client!: RedisClient
    public readonly connection!: WrappedNodeRedisClient
    public readonly prefix = process.env.REDIS_PREFIX + '_'

    @Inject()
    private readonly logger!: LoggerService

    constructor() {
        this.client = redis.createClient({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            password: process.env.REDIS_PASSWORD || undefined,
            prefix: this.prefix
        })
        this.listener()
        this.connection = createNodeRedisClient(this.client)
    }

    public async keysCustom(pattern: string): Promise<string[]> {

        let result = await this.connection.keys(`${this.prefix}${pattern}`)
        if (result.length <= 0) return []

        for (let i=0; i<result.length; i++) {
            result[i] = result[i].replace(this.prefix, '')
        }

        return result
    }

    private listener(): void {
        this.client.on('connect', () => {
            this.logger.info('Connection to redis')
        })
        this.client.on('error', (error) => {
            this.logger.error('Error redis', error)
        })
    }
}
