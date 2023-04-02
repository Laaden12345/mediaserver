import React, { useEffect } from "react"
import ReactPlayer from "react-player"
import { useAppSelector } from "../rtk/hooks"
import "./PlayerView.scss"

export const PlayerView = () => {
  const player = useAppSelector((state) => state.player)
  if (!player.media) return <div>No media</div>

  return (
    <div className="player-container">
      <ReactPlayer
        url={`${process.env.BACKEND_URL}/stream`}
        type="video/mp4"
        playing
        volume={1}
        width="100%"
        height="100%"
        className="player"
      />
    </div>
  )
}
