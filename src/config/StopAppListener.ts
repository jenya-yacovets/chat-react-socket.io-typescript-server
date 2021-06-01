import {Inject, Service} from "typedi"
import {promisify} from "util"

import {RedisConnection} from "./RedisConnection"
import Server from "../core"
import {LoggerService} from "../service/LoggerService"

@Service()
export class StopAppListener{

    private isUse: boolean = false

    @Inject()
    private logger!: LoggerService

    @Inject()
    private redis!: RedisConnection

    constructor(private server: Server) {
        console.log('StopAppListener run')
        this.listener()
    }

    private listener(): void {
        process.on('SIGTERM', this.stop)
        process.on('SIGINT', this.stop)
    }

    private async stop(signal: string): Promise<void> {
        if(!this.isUse) {
            this.isUse = true
        } else {
            return
        }

        await promisify(this.server.getServer().close)
        this.logger.info("Stop Server")

        await this.redis.connection.quit();
        this.logger.info("Close connection redis")

        this.logger.info("Close connection DB")

        this.logger.info("The application has successfully shut down", {signal})
        process.exit(0)
    }
}
