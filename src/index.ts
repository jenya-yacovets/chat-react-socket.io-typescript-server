import 'reflect-metadata'
import { useExpressServer, useContainer } from 'routing-controllers'
import { Container } from 'typedi'

import './util/env'
import './service'
import Server from './core'
import socket from './socket'
import controller from './controller'
import {
    ErrorHandlerMiddleware,
    ErrorNotFoundMiddleware
} from './middleware'


useContainer(Container)

const server: Server = new Server()
socket(server.getIo())

useExpressServer(server.getApp(), {
    routePrefix: '/v1',
    controllers: controller,
    defaultErrorHandler: false,
    middlewares: [
        ErrorHandlerMiddleware,
        ErrorNotFoundMiddleware
    ]
})

server.listen()

export default server
