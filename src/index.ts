import { useExpressServer } from 'routing-controllers'
import 'reflect-metadata'

import './util/env'
import Server from './core'
import socket from './socket'
import * as controller from './controller'
import { ErrorHandlerMiddleware, ErrorNotFoundMiddleware } from './middleware'

const server: Server = new Server()

useExpressServer(server.getApp(), {
    routePrefix: '/v1',
    controllers: controller.v1,
    defaultErrorHandler: false,
    middlewares: [
        ErrorHandlerMiddleware,
        ErrorNotFoundMiddleware
    ]
})
socket(server.getIo())

server.listen()

export default server