const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

async function connectDB(){
    // const url = 'mongodb://localhost:27017/shop'
    const url = 'mongodb+srv://quangdangthai2k3:quangdangthai2k3@myproject.ndwtstx.mongodb.net/shop?retryWrites=true&w=majority'
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })                
        console.log("connected to db")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB