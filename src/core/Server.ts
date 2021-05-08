import http from 'http'
import express from 'express'
import SocketIO from 'socket.io'

import App from './App'
import Socket from './Socket'

export default class Server {
  private readonly server: http.Server
  private readonly app: express.Application
  private readonly io: SocketIO.Server
  private port!: string | number

  constructor() {
    this.app = new App().getApp()
    this.server = http.createServer(this.app)
    this.io = new Socket(this.server).getIo()

    this.checkPort()
  }

  private checkPort(): void {
    if(isNaN(Number(process.env.PORT))) {
      throw new Error('Invalid port server')
    }
    this.port = Number(process.env.PORT)
  }

  public listen(cb?: Function): void {
    this.server.listen(this.port, () => {
      if(cb) {
        cb()
      } else {
        console.log(`Server is running on port ${this.port}`)
      }
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
