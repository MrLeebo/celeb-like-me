import { BlitzApiRequest, BlitzApiResponse } from "blitz"

export default function test(req: BlitzApiRequest, res: BlitzApiResponse) {
  res.json({
    message: "it worked",
  })
}
