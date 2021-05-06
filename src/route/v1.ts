import { Router } from "express";

export default (router: Router) => {
    router.get('/ping', (req, res, next) => {
        res.json({
            success: true,
            data: 'pong'
        })
    })
}