import { UpdateQuery } from "mongoose";
import { SlideModel, ISlide } from "../model/slideModel";

export const getSlidesService = async (onlyActive = true) => {
    const query = onlyActive ? { active: true } : {};
    return await SlideModel.find(query).sort({ createdAt: -1 });
};

export const createSlideService = async (data: Omit<ISlide, "_id">) => {
    const newSlide = new SlideModel(data);
    return await newSlide.save();
};

export const updateSlideService = async (id: string, data: UpdateQuery<ISlide>) => {
    if (data && (data as any)._id) delete (data as any)._id;
    
    const updatedSlide = await SlideModel.findByIdAndUpdate(id, data, { new: true });
    if (!updatedSlide) throw new Error("Slide não encontrado");
    
    return updatedSlide;
};

export const deleteSlideService = async (id: string) => {
    const deleted = await SlideModel.findByIdAndDelete(id);
    if (!deleted) throw new Error("Slide não encontrado");
    return deleted;
};