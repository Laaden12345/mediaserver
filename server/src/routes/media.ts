import { getSeasonsForSeries } from "../controllers/seasonController"
import { Router } from "express"
import {
  getAllSeries,
  getSeries,
  searchSeries,
} from "../controllers/seriesController"
import {
  getEpisodesForSeason,
  searchEpisodes,
} from "../controllers/episodeController"
const router = Router()
router.get("/series", async (req, res) => {
  await getAllSeries(req, res)
})

router.get("/series/:id(\\d+)", async (req, res) => {
  await getSeries(req, res)
})

router.get("/series/search", async (req, res) => {
  await searchSeries(req, res)
})

router.get("/series/:id(\\d+)/seasons", async (req, res) => {
  await getSeasonsForSeries(req, res)
})

router.get("/seasons/:id(\\d+)/episodes", async (req, res) => {
  await getEpisodesForSeason(req, res)
})

router.get("/episodes/search", async (req, res) => {
  await searchEpisodes(req, res)
})

export default router
