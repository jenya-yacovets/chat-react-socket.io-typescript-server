import 'reflect-metadata'
import { useExpressServer, useContainer as rcUseContainer } from 'routing-controllers'
import { useContainer as ormUseContainer } from 'typeorm'
import { useContainer as cvUseContainer} from 'class-validator'

import { Container } from 'typedi'

import './util/env'
import './config/redisConnection'
import './service'
import './config/dbConnection'
import Server from './core'
import socket from './socket'
import {
    currentUserMiddleware,
    ErrorHandlerMiddleware,
    ErrorNotFoundMiddleware
} from './middleware'
import {authorizationMiddleware} from "./middleware";

rcUseContainer(Container)
// cvUseContainer(Container)
// ormUseContainer(Container)

const server: Server = new Server()
socket(server.getIo())

useExpressServer(server.getApp(), {
    routePrefix: '/v1',
    classTransformer: true,
    controllers: [__dirname + '/controller/*{.js,.ts}'],
    defaultErrorHandler: false,
    authorizationChecker: authorizationMiddleware,
    currentUserChecker: currentUserMiddleware,
    middlewares: [
        ErrorHandlerMiddleware,
        ErrorNotFoundMiddleware
    ]
})

server.listen()

export default server
