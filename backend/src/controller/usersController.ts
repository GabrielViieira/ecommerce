import { Request, Response } from "express"
import * as usersServices from "../services/usersServices.ts"
import { UserQuery } from "../types/usersTypes.ts"
import { createToken } from "../middlewares/userAuth.ts"

type Params = {
  id: string
}

export const getUser = async (req: Request, res: Response) => {

  try {
    const user = await usersServices.getUserService(req.body)
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar lista de usuário" })
  }
}

export const getUsersbyName = async (req: Request, res: Response) => {
  try {
    const { username } = req.params as any
    const user = await usersServices.getUserbyNameService(username)
    res.json(user)
  } catch (error) {
    res.status(404).json({ error: "Erro ao buscar usuário" })
  }
}

export const getMe = async (req: Request, res: Response) => {
  try {

    const userId = (req as any).user._id
    const user = await usersServices.getUserbyIdService(userId)

    res.json(user)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await usersServices.createUserService(req.body)

    return res.status(201).json(newUser)
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return res.status(400).json({ 
        message: `Este ${field} já está em uso. Escolha outro.` 
      })
    }
    res.status(500).json({ error: "Erro ao criar usuário" })
  }
}

export const updateUser = async (req: Request<Params>, res: Response) => {
  try {
    const id = req.params.id
    const user = await req.body

    const userAtt = usersServices.updateUserService(id, user)
    res.json({ userAtt, message: "Usuario atualizado" })
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário" })
  }
}

export const deleteUsersbyID = async (req: Request<Params>, res: Response) => {
  try {
    const id = req.params.id
    const user = await usersServices.deleteUserService(id)
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário" })
  }
}

export const LoginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    const user = await usersServices.loginUserService(username, password)
    const token = createToken(user)

    res.json(token)
  } catch (err) {
    res.status(401).json({ error: "Erro ao validar login" })
  }
}