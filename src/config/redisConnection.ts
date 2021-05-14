import redis from 'redis'
import {createNodeRedisClient, WrappedNodeRedisClient} from 'handy-redis'
import {Service} from "typedi"

@Service({
    eager: true
})
export class RedisClient {
    private client!: any
    private handyRedis!: WrappedNodeRedisClient
    private readonly prefix = process.env.REDIS_PREFIX + '_'

    constructor() {
        this.init()
    }

    private init(): void {
        this.client = redis.createClient({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            password: process.env.REDIS_PASSWORD || undefined,
            prefix: this.prefix
        })

        this.client.on('connect', () => {
            console.log('Connection to redis')
        })
        this.client.on('error', (error) => {
            console.error(error)
        })

        this.handyRedis = createNodeRedisClient(this.client)
    }

    public connect() {
        return this.handyRedis
    }

    public async keysCustom(pattern: string): Promise<string[]> {

        let result = await this.handyRedis.keys(`${this.prefix}${pattern}`)
        if (result.length <= 0) return []

        for (let i=0; i<result.length; i++) {
            result[i] = result[i].replace(this.prefix, '')
        }

        return result
    }
}