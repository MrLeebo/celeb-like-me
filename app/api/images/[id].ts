import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import https from "https"
import db from "db"

export default async function getImage(req: BlitzApiRequest, res: BlitzApiResponse) {
  const { id } = req.query
  const img = await db.image.findOne({ where: { id: Number(id) } })

  const proxy = https.request(img.url, (imgRes) => {
    res.status(imgRes.statusCode)
    res.writeHead(imgRes.statusCode, imgRes.headers)
    res.send(imgRes)
  })

  req.pipe(proxy, { end: true })
}
