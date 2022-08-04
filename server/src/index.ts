import express, { Router } from "express"
import userRouter from "./routes/users"
import morgan from "morgan"
import bp from "body-parser"
import { errorHandler } from "./middlewares/errors"

const app = express()
const router = Router()
const port = process.env.PORT

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.use("/users", userRouter)

app.use(errorHandler)

export = router
// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
})