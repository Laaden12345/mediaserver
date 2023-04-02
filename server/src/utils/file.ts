import fs from "fs"
import { FileInfo } from "types"

import { VideoType } from "../db/models/media"

const extensions = /(?:mkv)|(?:mp4)|(?:avi)|(?:flv)/
const yearPattern = /\(\d{4}\)/
const seasonEpisodePattern = /([sS]\d{2}[eE]\d{2})/
const seasonPattern = /(Season \d{1,3})/
const episodePattern = /([eE]\d{2})/

export const getNestedFiles = (path, fileArray = []) => {
  const files = fs.readdirSync(path)
  let newFileArray = fileArray || []

  files.forEach((file) => {
    if (fs.statSync(`${path}/${file}`).isDirectory()) {
      newFileArray = getNestedFiles(`${path}/${file}`, newFileArray)
    } else {
      newFileArray.push(`${path}/${file}`)
    }
  })
  return newFileArray
}

/**
 * Gets the series name, season, episode, and year from the file path
 * @param file file path
 * @param videoType
 * @returns
 */
export const getInfoFromFile = (
  file: string,
  videoType: VideoType
): FileInfo => {
  if (extensions.test(file.split(".").pop())) {
    const info = { path: file } as FileInfo
    try {
      const splitPath = file.split("/")
      const fileName = splitPath[splitPath.length - 1]

      // Assume the folder structure is ./seriesName/Season/fileName.mkv
      let seriesNameFromFilePath = splitPath[splitPath.length - 3]

      // Remove the year in parenthesis
      seriesNameFromFilePath = seriesNameFromFilePath.replace(yearPattern, "")
      info["seriesName"] = seriesNameFromFilePath
      console.log(`seriesName: ${info["seriesName"]}`)

      if (!info["seriesName"])
        throw new Error(`Failed to get series name from path`)

      info["path"] = file
      const yearMatch = seriesNameFromFilePath.match(yearPattern)
      yearMatch && (info["year"] = yearMatch[0].slice(1, -1))

      // Search for a season-episode pattern (S01E01)
      const seasonEpisodeMatch = fileName.match(seasonEpisodePattern)
      if (seasonEpisodeMatch) {
        const seasonEpisode = seasonEpisodeMatch[0]
        console.log(`seasonEpisode: ${seasonEpisode}`)

        // Get season from the season-episode pattern
        const seasonMatch = seasonEpisode.toLowerCase().match(/[s]\d{2}/)
        if (seasonMatch) {
          const season = parseInt(seasonMatch[0].split("s")[1])
          info["seasonNumber"] = season
        }
        // Do the same for episode
        const episodeMatch = seasonEpisode.toLowerCase().match(/[e]\d{2}/)
        if (episodeMatch) {
          const episode = parseInt(episodeMatch[0]?.split("e")[1])
          console.log(`episode: ${episode}`)

          info["episodeNumber"] = episode
        }
      } else {
        const seasonFromPathMatch =
          splitPath[splitPath.length - 2].match(seasonPattern)

        if (seasonFromPathMatch) {
          info["seasonNumber"] = parseInt(
            seasonFromPathMatch[0].toLowerCase().split("season ")[1]
          )
        }

        let episodeMatch: RegExpMatchArray
        let episode: number

        // Check if the file name has the episode number in the beginning
        episodeMatch = fileName.match(/^(\d{1,3})/)
        if (episodeMatch) {
          episode = parseInt(episodeMatch[0])
          info["episodeNumber"] = episode
          console.log(
            `episode found from the start of the file name: ${episode}`
          )
          return info
        }
        // Check if the file name has the episode number in the end
        episodeMatch = fileName.match(/(\d{1,3})\./)
        if (episodeMatch) {
          episode = parseInt(episodeMatch[0].slice(0, -1))
          info["episodeNumber"] = episode
          console.log(`episode found from the end of the file name: ${episode}`)
          return info
        }
        // Search for the episode in E01 format (the most error prone solution)
        episodeMatch = fileName.toLowerCase().match(/[e]\d{2}/)
        if (episodeMatch) {
          episode = parseInt(episodeMatch[0]?.split("e")[1])
          console.log(`episode: ${episode}`)

          info["episodeNumber"] = episode
          return info
        } else {
          throw new Error(`Failed to get episode number from path`)
        }
      }
    } catch (e) {
      console.error(`failed to process file ${file}: ${e}`)
    }

    return info
  } else {
    return null
  }
}
