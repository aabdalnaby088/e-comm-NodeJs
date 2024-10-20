import mongoose, { connect } from "mongoose";

export const dbConnection = connect('mongodb+srv://myecommNode:THv4UsZLOEgCOzAb@cluster0.mnlil.mongodb.net/').then(()=>{
    console.log('db connected');
    
})