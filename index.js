import express from "express"
import { dbConnection } from "./db/connection.js"
import { bootstrap } from "./src/modules/bootstrap.js"
import { AppError } from "./src/utils/appError.js"
import { globalError } from "./src/middlewares/globalError.js"
import { config } from "dotenv"
import cors from 'cors'
import Stripe from "stripe"
import { catchError } from "./src/middlewares/catchError.js"
const app = express()
config(); 
const port = process.env.PORT || 3000
const stripe = new Stripe(process.env.SECRET_KEY);

app.post('/api/webhook', express.raw({ type: 'application/json' }), catchError((req, res) => {
    const sig = req.headers['stripe-signature'].toString();

    let event;

    event = stripe.webhooks.constructEvent(req.body, sig, "whsec_rzQAzsoSyYIl2rWvCw7FqhRAOzVAxGve");
    let checkout 
    // Handle the event
    if (event.type == 'checkout.session.completed'){
        checkout = event.data.object;
    }
    res.status(200).json({message: "success" ,checkout});
}));


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