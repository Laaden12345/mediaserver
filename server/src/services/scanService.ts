import axios from "axios"
import { Episode, Season, Series } from "../db/models/media"

const tmdbBaseUrl = `https://api.themoviedb.org/3`

/**
 * An axios instance for the TMDB API that automatically adds the bearer token to a request
 */
const tmdbApiInstance = axios.create({
  baseURL: tmdbBaseUrl,
  headers: {
    Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
  },
})

/**
 * Gets series information from TMDB if the series does not already exist in the database
 * @param episode The episode that belongs to the series
 * @param force Whether to force a search for the series even if it already exists in the database
 * @returns The series that the episode belongs to or null if the series could not be found or created
 */
export const handleSeries = async (episode: Episode, force: boolean) => {
  let requests = 0
  console.log(`handling episode for series ${episode.seriesName}`)

  // Check for existing series
  let series = await Series.findOne({ where: { name: episode.seriesName } })

  if (series && !force) {
    console.log(`Found series ${series.name}`)
    return series
  } else {
    // Search TMDB for the series
    let seriesData
    try {
      const seriesSearchResult = await tmdbApiInstance.get(
        `/search/tv?query=${episode.seriesName}`
      )

      seriesData =
        seriesSearchResult.data?.results && seriesSearchResult.data.results[0]
      requests++
    } catch (error) {
      console.error("Error searching for series:")
      console.error(error)
    }
    const newSeries = new Series({})

    const seriesId: number = seriesData ? seriesData.id : null
    if (seriesId) {
      // Re-check the series in the database with the tmdbID in case the
      // name from the path differs with the real name
      series = await Series.findOne({ where: { tmdbID: seriesId } })
      if (series && !force) {
        console.log(`Found series ${series.name} with tmdbID ${seriesId}`)
        return series
      }
      try {
        const seriesResult = await tmdbApiInstance.get(`/tv/${seriesId}`)
        requests++
        if (seriesResult.data) {
          ;(newSeries.name = seriesResult.data.name),
            (newSeries.tmdbID = seriesId),
            (newSeries.releaseDate = seriesResult.data.first_air_date),
            (newSeries.description = seriesResult.data.overview)
        } else {
          return null
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      newSeries.name = episode.seriesName
    }
    await newSeries.save()
    console.log(`Created series ${newSeries.name}`)

    return newSeries
  }
}

/**
 * Gets season information from TMDB if the season does not already exist in the database
 * @param series The series the season belongs to
 * @param episode The episode that belongs to the season
 * @param force Whether to force a search for the season even if it already exists in the database
 * @returns The season that the episode belongs to or null if the season could not be found or created
 */
export const handleSeason = async (
  series: Series,
  episode: Episode,
  force: boolean
) => {
  // Check for existing season
  let season = await Season.findOne({
    include: { model: Series, as: "series", where: { id: series.id } },
    where: { number: episode.seasonNumber },
  })
  console.log(`season: ${season}`)

  if (season && !force) {
    // return the season from database if it exists
    console.log(`Found season ${season.number} for ${series.name}`)
    return season
  } else {
    try {
      const seasonRequest = await tmdbApiInstance.get(
        `/tv/${series.tmdbID}/season/${episode.seasonNumber}`
      )

      if (seasonRequest.data) {
        season = new Season({
          number: episode.seasonNumber,
          tmdbID: seasonRequest.data.id,
          description: seasonRequest.data.overview,
          seriesId: series.id,
        })
      }
      console.log(`Creating season ${season.number} for ${series.name}`)

      await season.save()
      return season
    } catch (error) {
      console.error(error)
      return null
    }
  }
}

/**
 * Gets episode information from TMDB if the episode does not already exist in the database
 * @param series The series the episode belongs to
 * @param season The season the episode belongs to
 * @param episode The episode to be handled
 * @param force Whether to force a search for the episode even if it already exists in the database
 * @returns The episode that was handled or null if the episode could not be found or created
 */
export const handleEpisode = async (
  series: Series,
  season: Season,
  episode: Episode,
  force: boolean
) => {
  console.log("episode:")
  console.log(episode)

  // Create where clauses for the series and season to be used in the database query
  let seriesWhere = {}
  if (series) {
    seriesWhere = { id: series.id }
  }
  let seasonWhere = {}
  if (season) {
    seasonWhere = { id: season.id }
  }
  // Check for existing episode
  let episodeResult = await Episode.findOne({
    include: [
      { model: Series, as: "series", where: seriesWhere },
      { model: Season, as: "season", where: seasonWhere },
    ],
    where: { episodeNumber: episode.episodeNumber },
  })

  if (episodeResult && !force) {
    // return the episode from database if it exists
    console.log(
      `Found episode ${episodeResult.episodeNumber} for ${series.name} season ${season.number}`
    )
    return episodeResult
  } else {
    try {
      const episodeRequest = await tmdbApiInstance.get(
        `/tv/${series.tmdbID}/season/${season.number}/episode/${episode.episodeNumber}`
      )

      if (episodeRequest.data) {
        const releaseDate = Date.parse(episodeRequest.data.air_date)
        episodeResult = new Episode({
          seriesName: episode.seriesName,
          path: episode.path,
          episodeNumber: episode.episodeNumber,
          tmdbID: episodeRequest.data.id,
          description: episodeRequest.data.overview,
          releaseDate,
          name: episodeRequest.data.name,
          seriesId: series.id,
          seasonId: season.id,
        })
      }
      console.log(
        `Creating episode ${episodeResult.episodeNumber} for ${series.name} season ${season.number}`
      )

      await episodeResult.save()
      return episodeResult
    } catch (error) {
      console.error("Error creating episode:")
      console.error(error)
      return null
    }
  }
}
