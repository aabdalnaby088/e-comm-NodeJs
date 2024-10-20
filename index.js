import express from "express"
import { dbConnection } from "./db/connection.js"
import { bootstrap } from "./src/modules/bootstrap.js"
import { AppError } from "./src/utils/appError.js"
import { globalError } from "./src/middlewares/globalError.js"
import { config } from "dotenv"
import cors from 'cors'
import Stripe from "stripe"
import { catchError } from "./src/middlewares/catchError.js"
import { User } from "./db/models/user.model.js"
import { Order } from "./db/models/order.model.js"
import { Cart } from "./db/models/cart.model.js"
import { Product } from "./db/models/product.model.js"
const app = express()
config(); 
const port = process.env.PORT || 3000
const stripe = new Stripe(process.env.SECRET_KEY);

app.post('/api/webhook', express.raw({ type: 'application/json' }), catchError(async (req, res) => {
    const sig = req.headers['stripe-signature'].toString();

    let event;

    event = stripe.webhooks.constructEvent(req.body, sig, "whsec_rzQAzsoSyYIl2rWvCw7FqhRAOzVAxGve");
    let checkout 
    // Handle the event
    if (event.type == 'checkout.session.completed'){
        checkout = event.data.object;

        let user = await User.findOne({ email: checkout.customer_email })
        const cart = await Cart.findById(checkout.client_reference_id);
        if (!cart) {
            return next(new AppError("cart not found", 404))
        }
        const order = await Order.create({
            user: user._id,
            orderItems: cart.cartItems,
            shippingAddress: checkout.metadata,
            totalOrderPrice: checkout.amount_total /100,
            paymentType : "cart",
            isPaid: true
        })
        await order.save();
        // cart.cartItems.forEach(async (product, idx)=> {
        //     let myProduct = await Product.findByIdAndUpdate(product.product, {
        //         $inc: { stock: product.quantity*-1 },
        //         $inc: { sold: product.quantity*1 },
        //     })
        // })
        const options = cart.cartItems.map(product => {
            return ({
                updateOne: {
                    "filter": { _id: product.product },
                    "update": { $inc: { sold: 1 * product.quantity, stock: -1 * product.quantity } }
                }
            })
        })
        await Product.bulkWrite(options)
        await Cart.findByIdAndDelete(cart._id);
        res.status(200).json({ message: 'success', order });
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