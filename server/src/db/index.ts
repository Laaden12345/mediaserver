import { Pool } from "pg"
const pool = new Pool({
  user: process.env.PGUSER,
  host: "localhost",
  database: process.env.PGNAME,
  port: 5430
})
export default {
  query: (text: string, params: string[]) => pool.query(text, params),
}
