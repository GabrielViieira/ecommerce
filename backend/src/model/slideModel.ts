import mongoose, { Schema, Document } from "mongoose";

export interface ISlide extends Document {
    imageUrl: string;
    linkTo?: string;
    active: boolean;
}

const SlideSchema: Schema = new Schema({
    imageUrl: { type: String, required: true, trim: true },
    linkTo: { type: String, default: "" },
    active: { type: Boolean, default: true }
}, { collection: 'slides', timestamps: true });

export const SlideModel = mongoose.model<ISlide>("Slide", SlideSchema);
