import 'reflect-metadata'
import { Container } from 'typedi'
import { useExpressServer, useContainer as rcUseContainer } from 'routing-controllers'

import './util/env'
import './config/dbConnection'
import Server from './core'
import socket from './socket'

import {
    currentUserMiddleware,
    ErrorHandlerMiddleware,
    ErrorNotFoundMiddleware,
    authorizationMiddleware
} from './middleware'

const server: Server = new Server()

rcUseContainer(Container)

useExpressServer(server.getApp(), {
    routePrefix: '/v1',
    controllers: [__dirname + '/controller/*{.js,.ts}'],
    defaultErrorHandler: false,
    authorizationChecker: authorizationMiddleware,
    currentUserChecker: currentUserMiddleware,
    middlewares: [
        ErrorHandlerMiddleware,
        ErrorNotFoundMiddleware
    ]
})

socket(server.getIo())

server.listen()
