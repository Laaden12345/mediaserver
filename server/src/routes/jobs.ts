import { scanSeries } from "../controllers/jobsController"
import { Router } from "express"
const router = Router()

router.get("/scan/series", async (req, res) => {
  await scanSeries(req, res)
})

export default router
