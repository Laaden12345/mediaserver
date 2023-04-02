import { Episode, Movie } from "../db/models/media"
import { Router } from "express"
import fs from "fs"

const router = Router()
router.get("/", async (req, res) => {
  const id = "7e14b0cf-0da1-4484-a8d4-03fee0457a4e"
  console.log(id)

  let media: Movie | Episode = await Movie.findOne({
    where: { id: id },
  })
  if (!media) {
    media = await Episode.findOne({ where: { id: id } })
  }
  if (!media) {
    res.status(404).send({ message: "Media not found" })
    return
  }
  const path = media.path

  const stat = fs.statSync(path)
  console.log(stat)

  const fileSize = stat.size
  console.log(`fileSize: ${fileSize}`)

  const range = req.headers.range
  const extension = path.split(".").pop()

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    console.log(`start: ${start}, end: ${end}`)

    const chunksize = end - start + 1
    const file = fs.createReadStream(path, { start, end })
    const extension = path.split(".").pop()
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": `video/${extension}`,
    }
    res.writeHead(206, headers)
    file.pipe(res)
  } else {
    const headers = {
      "Content-Length": fileSize,
      "Content-Type": `video/${extension}`,
    }
    res.writeHead(200, headers)
    fs.createReadStream(path).pipe(res)
  }
})

export default router
