import './util/env'
import Server from './core'
import socket from './socket'
import route from './route'

const server: Server = new Server()
route(server.getApp())
socket(server.getIo())

server.listen()

export default server