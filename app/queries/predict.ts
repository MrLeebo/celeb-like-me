import Clarifai from "clarifai"
import db, { FindOneImageArgs } from "db"
// import config from "blitz.config"

export default async function predict(args: FindOneImageArgs) {
  const { id, url } = await db.image.findOne(args)

  const client = new Clarifai.App({ apiKey: process.env.CLARIFAI_KEY })

  const res = await client.models.predict(Clarifai.CELEBRITY_MODEL, url)

  if (res.status.description !== "Ok") {
    return { error: { message: `Unexpected status: ${res.status.description}` } }
  }

  await db.image.update({ data: { updatedAt: new Date() }, where: { id } })

  return { result: { matches: res.outputs[0].data.regions[0].data.concepts } }
}

/*
function urlForImage(id) {
  return `${config.defaultUrlOptions.protocol}://${config.defaultUrlOptions.host}/api/images/${id}`
}
*/
