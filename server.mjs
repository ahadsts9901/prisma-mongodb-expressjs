import express, { json } from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser"

import postRoutes from "./routes/post.mjs"
import authRoutes from "./routes/auth.mjs"
import profileRoutes from "./routes/profile.mjs"

import { jwtMiddleware } from "./middlewares/jwt.middleware.mjs"

const app = express()

app.use(json())
app.use(morgan('dev'))
app.use(cookieParser())

app.use('/api/v1', authRoutes)
app.use('/api/v1', jwtMiddleware)
app.use('/api/v1', postRoutes)
app.use('/api/v1', profileRoutes)

const PORT = process.env.PORT || 5002

app.listen(PORT, () => console.log(`server running on port ${PORT}`))