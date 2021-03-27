import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from "dotenv"

const app = express()
dotenv.config()

// Server Config
app.use(express.json({ limit: "30mb" }))
app.use(express.urlencoded( { limit: "30mb", extended: true } ))
app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello to memories API")
})

// Database Config
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.DATABASE_CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch(error => console.log(error))

mongoose.set('useFindAndModify', false)

// Routes
import postRoutes from './routes/post.js'
import userRoutes from "./routes/user.js"
app.use('/posts', postRoutes)
app.use("/user", userRoutes)