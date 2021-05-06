import { Application, Router } from 'express'

import v1 from './v1'
import error from './error'

export default (app: Application) => {
    const routeV1: Router = Router()

    app.use('/v1', routeV1)
    v1(routeV1)

    error(app._router)
}