import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

export default class App {
  private app: express.Application

  constructor() {
    this.app = express()
    this.app.use(helmet())
    this.app.use(cors({
      origin: true
    })) 
  }

  public getApp(): express.Application {
    return this.app
  }
}
