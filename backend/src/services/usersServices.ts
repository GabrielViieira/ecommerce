import { IUser } from "../model/userModel.ts"
import { usersRepository } from "../repositories/usersData.ts"
import { UserQuery } from "../types/usersTypes.ts"



export const getUserService = async (query: UserQuery) => {
  const data = await usersRepository.findAll(query)

  return data
}

export const getUserbyNameService = async (username: string) => {
  const data = await usersRepository.findByName(username)

  return data
}

export const getUserbyIdService = async (id: string) => {
  const response = await usersRepository.findById(id)

  return response
}

export const createUserService = async (data: Partial<IUser>) => {
  await usersRepository.createUser(data)

  return data
}

export const updateUserService = async (id: string, data: Partial<IUser>) => {

  const user = await usersRepository.update(id, data)

  delete data._id
  if (!user) throw new Error("Usuário não encontrado")

  return await usersRepository.update(id, data)
}

export const deleteUserService = async (id: string) => {
  const data = await usersRepository.delete(id)

  return data
}

export const loginUserService = async (username: string, password: string) => {
  const user = await usersRepository.login(username, password)

  if (!user) {
    throw new Error("Usuário não encontrado")
  }

  return user
}