import express from "express"
import jobsRouter from "./routes/jobs"
import mediaRouter from "./routes/media"
import morgan from "morgan"
import bp from "body-parser"
import { errorHandler } from "./middlewares/errors"

const app = express()
const port = process.env.PORT

app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.use("/jobs", jobsRouter)
app.use("/media", mediaRouter)

app.use(errorHandler)

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
