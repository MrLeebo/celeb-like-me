import db from "db"

export default function recent() {
  return db.image.findMany({ first: 10, orderBy: { createdAt: "desc" } })
}
