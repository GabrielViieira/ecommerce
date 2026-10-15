import jwt from "jsonwebtoken"
import { IUser } from "../model/userModel"
import { Request, Response, NextFunction } from "express"

const secret = process.env.SECRET_KEY as string
// const secret = "teste"

interface MyTokenPayload {
  roles: string[]
  _id: string
}

interface RequestWithUser extends Request {
  user?: MyTokenPayload;
}
export function createToken(user: IUser) {


  if (!secret) {
    throw new Error("SECRET_KEY não definida")
  }
  if (user.username === user.username && user.password === user.password) {
    return jwt.sign(
      {
        _id: user._id.toString(),
        username: user.username,
        password: user.password,
        roles: user.roles
      },
      secret,
      { expiresIn: "1h" }
    )
  } else {
    throw new Error('Usuario ou senha incorreto!')
  }


}

export async function loginAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: "Token não enviado" })
  }


  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, secret);

    (req as any).user = decoded

    next()
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" })
  }
}

export default function Authorize(roles: string[] = []) {
  return (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.headers['authorization']?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Access denied' })

    const decoded = jwt.verify(token, secret) as MyTokenPayload
    if (!decoded) return res.status(401).json({ error: 'Invalid token' })

    if (roles.length > 0) {
      const hasPermission = roles.some(role => decoded.roles.includes(role));

      if (!hasPermission) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
    }

    (req as any).user = decoded
    next()
  }
}