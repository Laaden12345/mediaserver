import axios, { AxiosResponse } from "axios"
import { postersPath } from "../config/config"
import Fs from "fs"
import path from "path"
import { TMDBConfiguration } from "types"

import cache from "./cache"

const tmdbBaseUrl = `https://api.themoviedb.org/3`

/**
 * An axios instance for the TMDB API that automatically adds the bearer token to a request
 */
export const tmdbApiInstance = axios.create({
  baseURL: tmdbBaseUrl,
  headers: {
    Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
  },
})

const posterSizePreferences = ["w342", "w500", "original"]
/**
 *
 */
export const getPoster = async (posterFileName: string) => {
  let tmdbConfig: TMDBConfiguration = cache.get("tmdbConfig")
  if (!tmdbConfig) {
    const tmdbConfigResponse = await tmdbApiInstance.get("/configuration")
    tmdbConfig = tmdbConfigResponse.data
    tmdbConfig && cache.set("tmdbConfig", tmdbConfig, 3600)
  }

  if (tmdbConfig?.images?.poster_sizes) {
    const posterSizes = tmdbConfig.images.poster_sizes
    const imageBaseUrl = tmdbConfig.images.base_url
    const preferredSize = posterSizePreferences.find((s) =>
      posterSizes.includes(s)
    )
    let posterUrl
    if (preferredSize) {
      posterUrl = `${imageBaseUrl}/t/p/${preferredSize}${posterFileName}`
    } else {
      const defaultSize = posterSizes[0]
      if (!defaultSize) return null
      posterUrl = `${imageBaseUrl}/t/p/${defaultSize}${posterFileName}`
    }
    const posterResponse = await axios.get(posterUrl, {
      responseType: "stream",
    })
    console.log(`Writing poster to ${path.join(postersPath, posterFileName)}`)

    const writer = Fs.createWriteStream(path.join(postersPath, posterFileName))
    posterResponse.data.pipe(writer)
    return new Promise((resolve, reject) => {
      writer.on("finish", resolve)
      writer.on("error", reject)
    })
  }
}
