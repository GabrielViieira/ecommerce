import mongoose, { Document } from "mongoose"
import { addMinutes, format } from 'date-fns'

export interface IUser extends Document {
  username: string,
  email: string,
  password: string,
  birth: Date,
  roles: string
}

const usersSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  birth: { type: Date },
  roles: { type: String, enum: ["admin", "seller", "user"], default: "user" },
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      if (ret.birth) {
        const date = new Date(ret.birth)
        const timezoneOffset = date.getTimezoneOffset();
        const correctedDate = addMinutes(date, timezoneOffset);

        ret.birth = format(correctedDate, 'dd/MM/yyyy');
      }
      delete ret.password
      delete ret.__v
      return ret
    }
  },
}
)

export const UserModel = mongoose.model<IUser>("Users", usersSchema)