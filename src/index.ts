import 'reflect-metadata'
import { useExpressServer, useContainer } from 'routing-controllers'
import { Container } from 'typedi'

import './util/env'
import './config/redisConnection'
import './service'
import './config/dbConnection'
import Server from './core'
import socket from './socket'
import {
    ErrorHandlerMiddleware,
    ErrorNotFoundMiddleware
} from './middleware'
import {authorizationMiddleware} from "./middleware/authorizationMiddleware";

useContainer(Container)

const server: Server = new Server()
socket(server.getIo())

useExpressServer(server.getApp(), {
    routePrefix: '/v1',
    controllers: [__dirname + '/controller/*{.js,.ts}'],
    defaultErrorHandler: false,
    authorizationChecker: authorizationMiddleware,
    middlewares: [
        ErrorHandlerMiddleware,
        ErrorNotFoundMiddleware
    ]
})

server.listen()

export default server
