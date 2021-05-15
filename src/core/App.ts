import express, {NextFunction, Request, Response} from 'express'
import cors from 'cors'
import helmet from 'helmet'
import expressStatusMonitor from 'express-status-monitor'
import expressRequestId from 'express-request-id'
import { getClientIp } from 'request-ip'
import useragent from 'express-useragent'

export default class App {
  private readonly app: express.Application

  constructor() {
    this.app = express()
    this.app.use(helmet())
    this.app.use(cors({
      origin: true
    }))
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(expressRequestId())
    this.app.use((req: any, res: Response, next: NextFunction) => {
        req.clientIp = getClientIp(req)
        next()
    })
    this.app.use(useragent.express())

    this.appMonitor()
  }

  private appMonitor(): void {
    if (process.env.NODE_ENV === 'development') {
      const statusMonitor = expressStatusMonitor()
      this.app.use(statusMonitor.middleware)
    }
  }

  public getApp(): express.Application {
    return this.app
  }
}
