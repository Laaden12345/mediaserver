export interface Series {
  id: string
  name: string
  description: string | null
  tmdbid: string | null
  releaseDate: Date | null
  poster: string | null
  updatedAt: Date
  createdAt: Date
  seasons?: Season[]
}

export interface Season {
  id: string
  tmdbid: string | null
  number: number
  description: string | null
  updatedAt: Date
  createdAt: Date
  seriesid: string
  episodes?: Episode[]
}

export interface Episode {
  id: string
  name: string | null
  description: string | null
  tmdbid: string | null
  releaseDate: Date | null
  updatedAt: Date
  createdAt: Date
  path: string
  thumbnail: string
  seriesName: string
  series: Series
  season: Season
  episodeNumber: number
  seasonNumber: number
}
