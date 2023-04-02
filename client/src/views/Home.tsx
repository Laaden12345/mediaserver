import React from "react"
import { useGetAllSeriesQuery } from "../rtk/slices/apiSlice"
import { HorizontalMenuList } from "../features/components/common/HorizontalMediaList"
import { PlayerView } from "./PlayerView"

const Home = () => {
  const { data: series, isLoading: seriesLoading } = useGetAllSeriesQuery({})
  console.log(series)

  return (
    <div className="appContainer">
      <h1>Media service</h1>
      <h2>Series</h2>
      <HorizontalMenuList
        data={series}
        isLoading={seriesLoading}
        type="series"
      />
    </div>
  )
}

export default Home
