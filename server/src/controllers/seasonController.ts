import { Season } from "../db/models/media"
import { Request, Response } from "express"

export const getSeasonsForSeries = async (req: Request, res: Response) => {
  const seriesId = req.params.id
  console.log(typeof seriesId)
  const season = await Season.findAll({ where: { seriesId: seriesId } })
  if (season) {
    res.send(season)
  } else {
    res.status(404).send("Season not found")
  }
}
