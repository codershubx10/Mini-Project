import express, { request, response } from "express";
import mongoose, { Schema } from "mongoose";
// import axios from 'axios';
// import nodemailer from 'nodemailer';


const app = express();
app.use(express.text());
app.use(express.json());


  
// CONNECTING TO DATABASE
const connectdb =async()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/playersDB');
        console.log("Database Connection Created")
    }catch(error){
        console.log(error);
    }
}

// CREATING A SCHEMA
const playerSchema = new Schema({
    name:String,
    jerseyNo: Number,
    age: Number,
    gender:String,
    playerID:Number
});
 
const Players = mongoose.model('players',playerSchema);


// TO HANDLE POST REQUEST COMING FROM CLIENT THROUGH POSTMAN AND SAVING THAT DATA INTO OUR DATABASE
app.post("/player",async(request,response)=>{
    try {
        const reqData = request.body;
        const playerDataFromClient = new Players(reqData)
        await playerDataFromClient.save();
        response.send({message:"Data saved successfully"})
    } catch (error) {
        response.send({message:"Something went wrong"})
    }
})

// TO HANDLE GET REQUEST COMING FROM CLIENT THROUGH POSTMAN AND DISPLAYING DATA FROM DB TO CLIENT
app.get("/player",async(request,response)=>{
    try {
        const showPlayerList = await Players.find();
        response.send({fetchedPlayerNames : showPlayerList})
    } catch (error) {
        response.send({message:'Something went wrong'})
    }
})

// TO HANDLE DELETE REQUEST COMING FROM CLIENT THROUGH POSTMAN AND DELETING THE GIVEN PLAYER 
app.delete('/player/:playerID',async (request,response)=>{
    try {
        await Players.deleteOne({playerID:request.params.playerID})
        response.send({message:'Player Deleted'});
    } catch (error) {
        response.status(500).send({message:'Something went wrong'});
    }
})

// TO HANDLE PUT(UPDATE) REQUEST COMING FROM CLIENT THROUGH POSTMAN AND UPDATING THE GIVEN PLAYER
app.put('/player/:playerID',async(request,response)=>{
    try {
        await Players.updateOne({playerID:request.params.playerID},request.body);
        response.send({message:'Player Updated'});
    } catch (error) {
        response.status(500).send({message:'Something went wrong'});
    }
})



// STARTING OUR SERVER
app.listen(4900,()=>{
    console.log("Server has started on 4900");
    connectdb();
});
