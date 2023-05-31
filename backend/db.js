const mongoose = require("mongoose")
const mongoURI = "mongodb://127.0.0.1:27017/"

const connectToMongo = () => {
    mongoose.connect(mongoURI).catch(error => console.log(error))
}

module.exports = connectToMongo