require("dotenv").config();
const express = require('express');
const{handler}=require('./controller/index');
const { startDb } = require("./database");
const PORT=process.env.TELE_PORT||4041;

 
startDb().catch(err => console.log(err));
// scheduleReminder(1782259864,2000); 
const app = express();
app.use(express.json());
app.post("*", async (req, res)=>{
    res.send(await handler(req, "POST"));
});
    
app.get("*",async (req, res)=>{
    res.send(await handler(req, "GET"));
})

app.listen(PORT, (err)=>{
    if(err) console.log(err);
    console.log(`Server is running on port ${PORT}`);
});