import React from "react"
import { useParams } from "react-router"
import { useGetSeriesQuery } from "../rtk/slices/apiSlice"

interface SeriesParams {
  seriesId: number
}

const SeriesView = () => {
  const { seriesId } = useParams()
  console.log(seriesId)
  const { data: series, isLoading: seriesLoading } = useGetSeriesQuery(seriesId)
  console.log(series)

  return <div>Series view</div>
}

export default SeriesView
