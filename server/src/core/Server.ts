import http from 'http'
import express from 'express'
import SocketIO from 'socket.io'

import App from './App'
import Socket from './Socket'

export default class Server {
  private server: http.Server
  private app: express.Application
  private io: SocketIO.Server
  private port!: string | number

  constructor() {
    this.app = new App().getApp()
    this.server = http.createServer(this.app)
    this.io = new Socket(this.server).getIo()

    this.checkPort()
    this.listen()
  }

  private checkPort(): void {
    if (typeof process.env.PORT === 'string') {
      this.port = Number(process.env.PORT.trim())
    } else if (typeof process.env.PORT === 'number') {
      this.port = process.env.PORT
    } else {
      throw new Error()
    }
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Runing server on port ${this.port}`)
    })
  }

  public getServer(): http.Server {
    return this.server
  }

  public getApp(): express.Application {
    return this.app
  }

  public getIo(): SocketIO.Server {
    return this.io
  }
}
