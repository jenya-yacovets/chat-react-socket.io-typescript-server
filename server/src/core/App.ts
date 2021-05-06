import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

export default class App {
  private app: express.Application

  constructor() {
    this.app = express()
    this.app.use(cors({
      origin: true
    }))
    this.app.use(helmet())
  }

  public getApp(): express.Application {
    return this.app
  }
}
