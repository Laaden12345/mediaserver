import bcrypt from "bcryptjs"
import { Request, Response } from "express"
import { generateToken } from "../utils/jwt"
import db from "../db"
import { User } from "../models/user"
import { parseScopes, stringifyScopes } from "../utils/psql"

const checkUserExists = async (username: string, email: string): Promise<boolean> => {
  try {
    const { rows } = await db.query(`SELECT (username, email) FROM accounts WHERE username ILIKE $1 OR email ILIKE $2;`, [username, email])
    return rows.length > 0
  } catch (error) {
    console.error(error)
  }
}

export const getUsers = async (req: Request, res: Response) => {
  const { rows } = await db.query('SELECT user_id, username, email, scopes, created_on, last_login FROM accounts;', [])
  rows.forEach(row => row.scopes = parseScopes(row.scopes))
  res.send(rows)
}

export const getById = async (req: Request, res: Response) => {
  const { rows } = await db.query('SELECT user_id, username, email, scopes, created_on, last_login FROM accounts WHERE user_id = $1;', [req.params.id])
  if (rows.length > 0) {
    rows[0].scopes = parseScopes(rows[0].scopes)
    res.send(rows[0])
  } else {
    res.status(404).send("User not found")
  }
}

export const createUser = async (req: Request, res: Response) => {
  const user: User = req.body
  const userExists = await checkUserExists(user.username, user.email)

  if (userExists) {
    res.status(409).send("User already exists, please login")
  } else {
    const salt = await bcrypt.genSalt()
    user.password = await bcrypt.hash(user.password, salt)

    const { rows } = await db.query(
      `INSERT INTO accounts (username, password, email, created_on) VALUES ($1, $2, $3, 'now') RETURNING user_id, username, email, created_on;`,
      [user.username, user.password, user.email]
    )

    const createdUser: User = rows[0]
    const token = generateToken(user)
    res.set("Authorization", `Bearer ${token}`)
    res.status(201).json(createdUser)
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  await db.query(`DELETE FROM accounts WHERE user_id = $1`, [req.params.userId])
  res.status(200).send("User deleted")
}

export const login = async (req: Request, res: Response) => {
  const username = req.body.username
  if (!username) {
    res.status(401).send("Please enter your username")
  } else {
    const { rows } = await db.query('SELECT username, password FROM accounts WHERE username = $1;', [req.body.username])
    if (rows.length == 0) {
      res.status(401).send("User does not exist")
    } else {
      let user = rows[0]
      const validPassword = await bcrypt.compare(req.body.password, user.password)

      if (validPassword) {
        const { rows } = await db.query("UPDATE accounts SET last_login = 'now' WHERE username = $1 RETURNING user_id, username, email, scopes, created_on, last_login;", [req.body.username])
        user = rows[0]
        user.scopes = parseScopes(user.scopes)

        const token = generateToken(user)

        res.set("Authorization", `Bearer ${token}`)
        res.status(200).json(user)
      } else {
        res.status(400).send("Invalid password")
      }
    }
  }
}

export const addScopes = async (req: Request, res: Response) => {
  const { rows } = await db.query('SELECT username, scopes FROM accounts WHERE username = $1;', [req.body.username])
  if (rows.length == 0) {
    res.status(401).send("User does not exist")
  } else {
    const user = rows[0]
    user.scopes = parseScopes(user.scopes)
    // combine scope lists removing duplicates 
    const newScopes = stringifyScopes([...new Set([...req.body.scopes, ...user.scopes])])

    const queryResponse = await db.query('UPDATE accounts SET scopes = $1 WHERE username = $2 RETURNING user_id, username, scopes;', [newScopes, req.body.username])

    const updatedUser = queryResponse.rows[0]
    updatedUser.scopes = parseScopes(updatedUser.scopes)
    res.status(200).json(updatedUser)
  }
}