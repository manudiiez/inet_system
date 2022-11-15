import express from "express"
import dotenv from 'dotenv'
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import cors from 'cors'
/* --------------------------------- ROUTES --------------------------------- */
import authRoute from './routes/auth.js'




const app = express()
dotenv.config()

// CONEXION A MONGODB
const connect = async ( ) => {
    try {
        // await mongoose.connect(process.env.MONGO);
        await mongoose.connect('mongodb://localhost:27017/inet');
        console.log('Connected to mongoDB')
    } catch (error) {
        throw error;
    }
}

// Si esta desconectada devuelve
mongoose.connection.on('disconnected', () => {
    console.log('mongoDB disconnected!!')
})
// Si esta conectada devuelve
mongoose.connection.on('connected', () => {
    console.log('mongoDB connected!!')
})

/* ------------------------------- MIDDLEWARES ------------------------------ */
app.use(cors())
app.use(cookieParser())
app.use(express.json())

// AUTH ROUTE
app.use('/api/auth', authRoute);



app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || 'Something went wrong!'
    return res.status(500).json({
        succest: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
})

app.listen(8800, () => {
    connect()
    console.log('Connected to backend!')
})