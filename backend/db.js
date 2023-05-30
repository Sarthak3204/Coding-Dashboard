import mongoose from "mongoose"
const mongoURI = "mongodb://127.0.0.1:27017"

export const connectToMongo = () => {
    mongoose.connect(mongoURI).catch(error => console.log(error)) 
}   