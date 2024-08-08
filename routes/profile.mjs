import { Router } from "express";
import { prisma } from "../prisma/index.mjs"

const router = Router()

router.get("/profile", async (req, res, next) => {

    try {

        const { id } = req?.currentUser

        if (!id || id?.trim() === "") {
            return res.status(400).send({
                message: "userId is required"
            })
        }

        const userData = await prisma.user.findUnique({
            where: { id: id }
        })

        const posts = await prisma.post.findMany({
            where: {
                authorId: id
            },
            orderBy: {
                id: "desc"
            },
            include: {
                author: true
            }
        })

        res.send({
            message: "profile fetched successfully",
            data: {
                user: userData,
                posts: posts
            }
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: "internal server error"
        })
    }

})

export default router