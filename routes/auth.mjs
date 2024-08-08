import { Router } from "express";
import bcrypt from "bcrypt"
import { prisma } from "../prisma/index.mjs"
import { signJwtToken } from "../middlewares/jwt.middleware.mjs";

const router = Router()

router.post('/signup', async (req, res, next) => {

    const { userName, email, password } = req?.body

    if (!userName || userName?.trim() === "") {
        return res.status(400).send({
            message: "username is required"
        })
    }

    if (!email || email?.trim() === "") {
        return res.status(400).send({
            message: "email is required"
        })
    }

    if (!password || password?.trim() === "") {
        return res.status(400).send({
            message: "password is required"
        })
    }

    try {

        const isEmailTaken = await prisma.user.findUnique({ where: { email: email } })

        if (isEmailTaken) {
            return res.status(400).send({
                message: "email already taken"
            })
        }

        const passwodHash = await bcrypt.hash(password, 12)

        const signupResp = await prisma?.user?.create({
            data: { userName: userName, email: email, password: passwodHash }
        })

        const jwtPayload = {
            userName: signupResp?.userName,
            email: signupResp?.email,
            id: signupResp?.id,
            createdOn: signupResp?.createdOn,
        }

        req.user = jwtPayload

        next()

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: "internal server error"
        })
    }

}, signJwtToken, (req, res) => {
    res.send({
        message: 'signup successfull'
    })
})

router.post('/login', async (req, res, next) => {

    const { email, password } = req?.body

    if (!email || email?.trim() === "") {
        return res.status(400).send({
            message: "email is required"
        })
    }

    if (!password || password?.trim() === "") {
        return res.status(400).send({
            message: "password is required"
        })
    }

    try {

        const user = await prisma.user.findUnique({ where: { email: email } })

        if (!user) {
            return res.status(400).send({
                message: "email or password incorrect"
            })
        }

        const isPasswordTrue = await bcrypt.compare(password, user?.password)

        if (!isPasswordTrue) {
            return res.status(400).send({
                message: "email or password incorrect"
            })
        }

        const jwtPayload = {
            userName: user?.userName,
            email: user?.email,
            id: user?.id,
            createdOn: user?.createdOn,
        }

        req.user = jwtPayload

        next()

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: "internal server error"
        })
    }

}, signJwtToken, (req, res) => {
    res.send({
        message: 'login successfull'
    })
})

router.post('/logout', (req, res, next) => {

    try {

        res.clearCookie("hart")
        res.send({ message: 'logout successful' });

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: "internal server error"
        })
    }

})

export default router