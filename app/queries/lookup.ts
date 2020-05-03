import got from "got"
import db from "db"

type GitHubProfile = {
  avatar_url: string
}

export default async function lookup({ username }) {
  const res = await got.get<GitHubProfile>(`https://api.github.com/users/${username}`, {
    responseType: "json",
  })

  const data = { url: res.body.avatar_url, username, updatedAt: new Date() }
  return db.image.upsert({ create: data, update: data, where: { url: data.url } })
}
