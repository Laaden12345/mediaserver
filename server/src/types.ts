export type FileInfo = {
  seriesName: string | null
  year: string | null
  path: string
  season: number | null
  episodeNumber: number | null
}

export interface TMDBConfiguration {
  images: {
    base_url: string
    secure_base_url: string
    backdrop_sizes: string[]
    logo_sizes: string[]
    poster_sizes: string[]
    profile_sizes: string[]
    still_sizes: string[]
  }
  change_keys: string[]
}
