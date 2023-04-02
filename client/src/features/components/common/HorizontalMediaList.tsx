import React, { useRef } from "react"
import { Episode, Series } from "../../../rtk/types"
import "./HorizontalMediaList.scss"
import { Card } from "./Card"
import { useNavigate } from "react-router"
import { play } from "../../../rtk/slices/playerSlice"
import { useDispatch } from "react-redux"
import { useAppDispatch } from "../../../rtk/hooks"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"

interface HorizontalMenuListProps {
  data: Series[] | Episode[]
  isLoading: boolean
  type: "series" | "episode" | "movie"
}

enum Direction {
  Left = "left",
  Right = "right",
}

export const HorizontalMenuList: React.FC<HorizontalMenuListProps> = ({
  data,
  isLoading,
}) => {
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  const scrollList = (direction: Direction) => {
    const scrollAmount = scrollRef.current.clientWidth
    const currentPosition = scrollRef.current.scrollLeft

    scrollRef.current.scrollTo({
      top: 0,
      left:
        currentPosition +
        (direction === "right" ? scrollAmount : -scrollAmount),
      behavior: "smooth",
    })
  }

  const handleDetailsClick = (id: string) => {
    navigate(`/series/${id}`)
  }

  return (
    <div className="horizontal">
      <div
        className="scroll-arrow left"
        onClick={() => scrollList(Direction.Left)}
      >
        <FaAngleLeft />
      </div>
      <div className="media-list" ref={scrollRef}>
        <>
          {isLoading && <div>Loading...</div>}
          {data &&
            data.map((media) => (
              <div
                key={media.id}
                className="media"
                onClick={() => handleDetailsClick(media.id)}
              >
                <Card media={media} />
                <h3 className="media-name">{media.name}</h3>
              </div>
            ))}
        </>
      </div>
      <div
        className="scroll-arrow right"
        onClick={() => scrollList(Direction.Right)}
      >
        <FaAngleRight />
      </div>
    </div>
  )
}
