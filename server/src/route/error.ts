import { Router } from "express";

export default (router: Router) => {

    router.use((error, req, res, next) => {

        if(error.message === 'notFound') {
            return next()
        } else {
            res.status(500)
            res.json({
                success: false,
                message: 'Server error'
            })
        }
    })

    router.use((req, res) => {
        res.status(404)
        res.json({
            success: false,
            message: 'API method not found'
        })
    })
}
