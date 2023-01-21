import { Episode } from "../db/models/media"
import { Request, Response } from "express"
import { Op } from "sequelize"

export const getEpisodesForSeason = async (req: Request, res: Response) => {
  const seasonId = req.params.id
  const episodes = await Episode.findAll({
    where: { seasonId: seasonId },
  })
  if (episodes) {
    res.send(episodes)
  } else {
    res.status(404).send("Episode not found")
  }
}

export const searchEpisodes = async (req: Request, res: Response) => {
  const keyword = req.query.keyword
  const episodes = await Episode.findAll({
    where: {
      name: {
        [Op.iLike]: `%${keyword}%`,
      },
    },
  })
  res.send(episodes)
}
