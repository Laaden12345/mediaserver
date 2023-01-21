import { Request, Response } from "express"
import { Op } from "sequelize"
import { Episode, Series } from "../db/models/media"

export const getAllSeries = async (req: Request, res: Response) => {
  const series = await Series.findAll()
  res.send(series)
}

export const getSeries = async (req: Request, res: Response) => {
  const series = await Series.findOne({ where: { id: req.params.id } })
  res.send(series)
}

export const searchSeries = async (req: Request, res: Response) => {
  const keyword = req.query.keyword
  const series = await Series.findAll({
    where: {
      name: {
        [Op.iLike]: `%${keyword}%`,
      },
    },
  })
  res.send(series)
}
