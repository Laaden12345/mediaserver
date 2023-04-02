import React from "react"
import { FaRegPlayCircle } from "react-icons/fa"
import { Episode, Series } from "../../../rtk/types"
import "./Card.scss"

interface CardProps {
  media: Series | Episode
  handlePlayClick?: (id: string) => void
}

export const Card: React.FC<CardProps> = ({ media, handlePlayClick }) => {
  let imageUrl =
    "poster" in media
      ? process.env.BACKEND_URL + "/posters" + media.poster
      : process.env.BACKEND_URL + "/thumbnails" + media.thumbnail

  return (
    <div className="card-container">
      <div
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
        className="card-image"
      >
        <div className="card-overlay">
          <FaRegPlayCircle
            className="play-icon"
            onClick={() => handlePlayClick(media.id)}
          />
        </div>
      </div>
    </div>
  )
}
