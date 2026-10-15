import { UserModel, IUser } from "../model/userModel.ts"
import { UserQuery } from "../types/usersTypes.ts"


export const usersRepository = {
    findAll: async (query: UserQuery): Promise<IUser[]> => {
        return await UserModel.find(query)
    },
    findByName: async (username: string): Promise<IUser | null> => {
        return await UserModel.findOne(username.toString)
    },
    findById: async (id: string): Promise<IUser | null> => {
        return await UserModel.findById(id)
    },
    createUser: async (data: Partial<IUser>): Promise<IUser> => {
        return await UserModel.create(data)
    },
    update: async (id: string, data: Partial<IUser>): Promise<IUser | null> => {
        return await UserModel.findByIdAndUpdate(
            id,
            { $set: data },
            { returnDocument: "after" }
        )
    },
    delete: async (id: string): Promise<IUser | null> => {
        return await UserModel.findByIdAndDelete(id)
    },

    login: async (username: string, password: string) => {
        const user = await UserModel.findOne({ username, password })

        return user
    }
}