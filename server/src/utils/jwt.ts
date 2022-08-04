import { sign, SignOptions, verify, VerifyOptions } from "jsonwebtoken"

interface TokenPayload {
  exp: number,
  scopes: string[],
  name: string,
  userId: number
}

export const generateToken = (payload: object) => {
  const signInOptions: SignOptions = {
    algorithm: "HS256",
    expiresIn: "1h"
  }
  return sign(payload, process.env.TOKEN_KEY, signInOptions)
}

export const validateToken = (token: string): Promise<TokenPayload> => {

  const verifyOptions: VerifyOptions = {
    algorithms: ['HS256'],
  }

  return new Promise((resolve, reject) => {
    verify(token, process.env.TOKEN_KEY, verifyOptions, (error, decoded: TokenPayload) => {
      if (error) return reject(error)

      resolve(decoded)
    })
  })
}
