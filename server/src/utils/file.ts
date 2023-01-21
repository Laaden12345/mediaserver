import fs from "fs"
import { FileInfo } from "types"

import { VideoType } from "../db/models/media"

const extensions = /(?:mkv)|(?:mp4)|(?:avi)|(?:flv)/
const yearPattern = /\(\d{4}\)/
const seasonChapterPattern = /([sS]\d{2}[eE]\d{2})|([eE]\d{2})/g
const seasonPattern = /(Season \d{1,3})/

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

export const getInfoFromFile = (
  file: string,
  videoType: VideoType
): FileInfo => {
  if (extensions.test(file.split(".").pop())) {
    const info = { path: file } as FileInfo
    try {
      const splitPath = file.split("/")

      let seriesNameFromFilePath = splitPath[splitPath.length - 3]

      // remove the year in parenthesis
      seriesNameFromFilePath = seriesNameFromFilePath.replace(yearPattern, "")
      info["seriesName"] = seriesNameFromFilePath
      console.log(`seriesName: ${info["seriesName"]}`)

      if (!info["seriesName"])
        throw new Error(`Failed to get series name from path`)

      info["path"] = file
      const yearMatch = splitPath[splitPath.length - 3].match(yearPattern)
      yearMatch && (info["year"] = yearMatch[0].slice(1, -1))
      info["year"] && console.log(info["year"])

      if (videoType == VideoType.Series) {
        const seasonChapterMatch =
          splitPath[splitPath.length - 1].match(seasonChapterPattern)
        if (seasonChapterMatch) {
          const seasonChapter = seasonChapterMatch[0]

          //search for a season pattern and remove the S to get season number
          const season = seasonChapter
            .toLowerCase()
            .match(/[s]\d{2}/)[0]
            .split("s")[1]
          const episode = seasonChapter
            .toLowerCase()
            .match(/[e]\d{2}/)[0]
            .split("e")[1]
          info["seasonNumber"] = parseInt(season)
          info["episodeNumber"] = parseInt(episode)
        } else {
          const seasonFromPathMatch =
            splitPath[splitPath.length - 2].match(seasonPattern)

          if (seasonFromPathMatch) {
            info["seasonNumber"] = parseInt(
              seasonFromPathMatch[0].toLowerCase().split("season ")[1]
            )
          }

          let episode: number
          // check if the file name has the episode number in the beginning
          const episodeMatchBeginning =
            splitPath[splitPath.length - 1].match(/^(\d{1,3})/)
          if (episodeMatchBeginning) {
            episode = parseInt(episodeMatchBeginning[0])
            info["episodeNumber"] = episode
            console.log(
              `episode found from the start of the file name: ${episode}`
            )
            return info
          }
          // check if the file name has the episode number in the end
          const episodeMatchEnd =
            splitPath[splitPath.length - 1].match(/(\d{1,3})\./)
          if (episodeMatchEnd) {
            episode = parseInt(episodeMatchEnd[0].slice(0, -1))
            info["episodeNumber"] = episode
            console.log(
              `episode found from the end of the file name: ${episode}`
            )
            return info
          } else {
            throw new Error(`Failed to get episode number from path`)
          }
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
