import "dotenv/config"
import jwt from "jsonwebtoken"

export const jwtMiddleware = async (req, res, next) => {

    try {

        const hart = req?.cookies?.hart

        if (!hart) {
            return res.status(401).send({
                message: "unauthorized"
            })
        }

        const currentUser = jwt.verify(hart, process.env.JWT_SECRET)

        req.currentUser = currentUser

        next()

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: "internal server error"
        })
    }

}

export const signJwtToken = async (req, res, next) => {

    try {

        const { user } = req

        if (!user) {
            return res.status(400).send({
                message: "user payload not provided"
            })
        }

        const hart = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '15d' })

        res.cookie('hart', hart, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days expiry
        });

        next()

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: "internal server error"
        })
    }

}