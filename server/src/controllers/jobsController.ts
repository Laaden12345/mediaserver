import { Request, Response } from "express"

import { getInfoFromFile, getNestedFiles } from "../utils/file"
import { Episode, VideoType } from "../db/models/media"
import {
  handleEpisode,
  handleSeason,
  handleSeries,
} from "../services/scanService"

export const scanSeries = async (req: Request, res: Response) => {
  const files = getNestedFiles("./media/tv")
  let totalFiles = 0
  const force = req.body.force === "true"

  for (const file of files) {
    totalFiles++
    console.log(`file: ${file}`)

    const infoResult = getInfoFromFile(file, VideoType.Series)
    if (!infoResult?.seriesName) continue

    const episode = new Episode(infoResult)
    const series = await handleSeries(episode, force)
    console.log(`series: ${series}`)

    const season = await handleSeason(series, episode, force)

    console.log(`season: ${season}`)

    const episodeResult = await handleEpisode(series, season, episode, force)
    console.log(`episodeResult: ${episodeResult}`)

    console.log("\n")
  }

  res.send({
    totalFiles: totalFiles,
  })
}
