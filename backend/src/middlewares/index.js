/**
 * Module dependencies.
 */
import * as jwt from "jsonwebtoken";

import config from "../config";

const JWT_SECRET = '0123456789'

const SECURE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  domain: '.foo.bar'
}

/**
 * It will create dummy JWT token, then 
 * add it as cookie in the response with
 * following options:
 * - httpOnly
 * - secure
 * - 15min max age
 * 
 * @param {Request}  req  - HTTP Request
 * @param {Response} res  - HTTP Response
 * @param {Next}     next - Next callback
 */
export const authenticate = (req, res, next) => {
  const token = jwt.sign({ foo: 'bar' }, JWT_SECRET )

  return res.cookie('token', token, 
    {
      ...SECURE_COOKIE_OPTIONS, 
      maxAge: 900000
    }
  ).end()
}

/**
 * It clears the token cookie.
 * 
 * @param {Request}  req  - HTTP Request
 * @param {Response} res  - HTTP Response
 * @param {Next}     next - Next callback
 */
export const unauthenticate = (req, res, next) => {
  return res.clearCookie('token', 
    {
      ...SECURE_COOKIE_OPTIONS
    }
  ).end()
}

/**
 * It makes sure there is a valid JWT token
 * sent with the request to ensure user is 
 * logged in, otherwise it sends 401 HTTP response.
 * 
 * @param {Request}  req  - HTTP Request
 * @param {Response} res  - HTTP Response
 * @param {Next}     next - Next callback
 */
export const ensureLoggedIn = (req, res, next) => {
  const { token } = req.cookies

  if (!token) {
    return res.status(401).end()
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    if (!decoded) {
      return res.status(401).end()
    }

  } catch (err) {
    console.error(err.message)
    return res.status(401).end()
  }

  next()
}