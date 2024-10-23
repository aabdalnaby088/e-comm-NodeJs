import cors from 'cors'
import { config } from "dotenv"
import express from "express"
import { globalError } from "./src/middlewares/globalError.js"
import { bootstrap } from "./src/modules/bootstrap.js"
import { AppError } from "./src/utils/appError.js"
import { dbConnection } from './db/connection.js'
const app = express()
config(); 
const port = process.env.PORT || 3000



app.use(cors());  
app.use(express.json());
app.use('/uploads' , express.static('uploads'))
bootstrap(app); 
app.use('*' , (req,res,next) => {
    next(new AppError(`route not found ${req.originalUrl}`, 404))
})
app.use(globalError)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// myecommNode
// THv4UsZLOEgCOzAb