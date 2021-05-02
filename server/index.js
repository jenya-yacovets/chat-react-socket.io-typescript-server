import { createServer } from 'http'
import { Server as ServerSocket } from 'socket.io'
import './util/env.js'
import socket from './socket.js'

const server = createServer()

const io = new ServerSocket(server, {
    cors: {
        origin: '*'
    }
})
socket(io)

const port = process.env.PORT
server.listen(port, () => {
    console.log(`Chat server runing on port ${port}`)
})