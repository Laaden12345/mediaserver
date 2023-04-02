import express from "express"
import morgan from "morgan"
import bp from "body-parser"
import cors from "cors"
import jobsRouter from "./routes/jobs"
import mediaRouter from "./routes/media"
import streamRouter from "./routes/stream"
import { errorHandler } from "./middlewares/errors"
import { postersPath } from "./config/config"

const app = express()
const port = process.env.PORT

app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))
app.use(cors())
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use("/posters", express.static(postersPath))
app.use("/jobs", jobsRouter)
app.use("/media", mediaRouter)
app.use("/stream", streamRouter)

app.use(errorHandler)

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
