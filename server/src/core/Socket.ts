import http from 'http'
import SocketIO from 'socket.io'

export default class Socket {
  private server: http.Server
  private io: SocketIO.Server

  constructor(server: http.Server) {
    this.server = server
    this.io = new SocketIO.Server(this.server, {
      cors: {
        origin: '*'
      }
    })
  }

  public getIo(): SocketIO.Server {
    return this.io
  }
}
