import mongoose from "mongoose";
import newModel from "../model/news.model.js";
import dataModel from "../model/data.model.js";

export default async() => await mongoose.connect('mongodb://127.0.0.1:27017/n37')
