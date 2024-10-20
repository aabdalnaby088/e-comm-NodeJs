import mongoose, { connect } from "mongoose";

export const dbConnection = connect('mongodb+srv://dbuser:123@cluster0.mnlil.mongodb.net/').then(()=>{
    console.log('db connected');
    
})