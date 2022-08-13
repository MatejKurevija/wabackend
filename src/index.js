

import express from "express";
import cors from "cors";
import connect from "./db.js";
import mongo from "mongodb";


const app = express(); // instanciranje aplikacije
//const port = process.env.PORT  3000; // port na kojem će web server slušati

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3100;

app.listen(port, function () {
    console.log("Server se slusa na portu", port);
});

app.get("/Proizvod", async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("Nesto").find()
    let result = await cursor.toArray()
    res.json(result)
})