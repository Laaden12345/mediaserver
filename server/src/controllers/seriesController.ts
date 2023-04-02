import { Request, Response } from "express"
import { Op } from "sequelize"
import { Episode, Series } from "../db/models/media"

export const getAllSeries = async (req: Request, res: Response) => {
  if (req.query.sortBy && req.query.orderBy) {
    console.log(Series.getAttributes())

    const sortBy = Object.keys(Series.getAttributes()).includes(
      req.query.sortBy as string
    )
      ? (req.query.sortBy as string)
      : "name"
    const orderBy = req.query.orderBy === "asc" ? "ASC" : "DESC"
    const series = await Series.findAll({
      order: [[sortBy, orderBy]],
    })
    res.send(series)
    return
  }
  const series = await Series.findAll()
  res.send(series)
}

export const getSeries = async (req: Request, res: Response) => {
  if (!req.params.id) {
    res.status(400).send({ message: "Invalid series ID" })
    return
  }
  const series = await Series.findOne({ where: { id: req.params.id } })
  console.log(req.params.id)

  if (!series) {
    res.status(404).send({ message: "Series not found" })
    return
  }
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
