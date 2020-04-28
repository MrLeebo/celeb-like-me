import Clarifai from "clarifai"
import db, { ImageCreateArgs } from "db"

export default async function predict(args: ImageCreateArgs) {
  const app = new Clarifai.App({ apiKey: process.env.CLARIFAI_KEY })
  const res = await app.models.predict(Clarifai.CELEBRITY_MODEL, args.data.url)

  if (res.status.description !== "Ok") return { error: { message: "Unexpected status" } }

  await db.image.upsert({
    create: args.data,
    update: args.data,
    where: {
      url: args.data.url,
    },
  })

  return { result: { matches: res.outputs[0].data.regions[0].data.concepts } }
}
