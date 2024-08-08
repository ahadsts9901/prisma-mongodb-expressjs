import { Router } from "express";
import { prisma } from "../prisma/index.mjs";

const router = Router()

router.post('/posts', async (req, res, next) => {

    const { title, description } = req?.body

    if (!title || title?.trim() === "") {
        return res.status(400).send({
            message: "title is required"
        })
    }

    if (!description || description?.trim() === "") {
        return res.status(400).send({
            message: "description is required"
        })
    }

    const { currentUser } = req

    try {

        const createPostResp = await prisma.post.create({
            data: {
                title: title,
                description: description,
                author: {
                    connect: { id: currentUser?.id },
                },
            }
        })

        res.send({
            message: "post created successfully"
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: "internal server error"
        })
    }

})

router.get('/posts', async (req, res, next) => {

    try {

        const posts = await prisma.post.findMany({
            orderBy: {
                id: 'desc',
            },
            include: {
                author: true,
            },
        })

        res.send({
            message: "posts fetched successfully",
            data: posts
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: "internal server error"
        })
    }

})

router.get('/posts/:postId', async (req, res, next) => {

    const { postId } = req?.params

    if (!postId || postId?.trim() === "") {
        return res.status(400).send({
            message: "postId is required"
        })
    }

    try {

        const post = await prisma.post.findFirst({
            where: {
                id: postId,
            },
            include: {
                author: true
            }
        })

        if (!post) {
            return res.send({
                message: "post not found",
            })
        }

        res.send({
            message: "post fetched successfully",
            data: post
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: "internal server error"
        })
    }

})

router.delete('/posts/:postId', async (req, res, next) => {

    const { postId } = req?.params

    if (!postId || postId?.trim() === "") {
        return res.status(400).send({
            message: "postId is required"
        })
    }

    try {

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        })

        if (!post) {
            return res.send({
                message: "post not found",
            })
        }

        const deleteResp = await prisma.post.delete({
            where: {
                id: postId,
            },
        })

        res.send({
            message: "post deleted successfully",
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: "internal server error"
        })
    }

})

router.put('/posts/:postId', async (req, res, next) => {

    const { currentUser } = req

    const { postId } = req?.params
    const { title, description } = req?.body

    if (!postId || postId?.trim() === "") {
        return res.status(400).send({
            message: "postId is required"
        })
    }

    if (!title || title?.trim() === "") {
        return res.status(400).send({
            message: "title is required"
        })
    }

    if (!description || description?.trim() === "") {
        return res.status(400).send({
            message: "description is required"
        })
    }

    try {

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        })

        if (!post) {
            return res.send({
                message: "post not found",
            })
        }

        const updatePostResp = await prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                title: title,
                description: description,
                author: {
                    connect: { id: currentUser?.id },
                },
            },
        });

        res.send({
            message: "post updated successfully"
        })

    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: "internal server error"
        })
    }

})

export default router