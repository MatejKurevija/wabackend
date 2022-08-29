
import dotenv from "dotenv";
dotenv.config()
import express from "express";
import cors from "cors";
import connect from "./db.js";
import mongo from "mongodb";
import auth from "./auth.js";


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

/* KORISNICI */

app.post("/auth", async (req, res) => {
    let user = req.body;

    try {
        let result = await auth.authenticateUser(user.username, user.password);
        res.json(result)
    }
    catch (e) {
        res.status(401).json({ error: 'Pogrešni podaci za prijavu' });
    }
});

app.post("/users", async (req, res) => {
    let user = req.body;

    let id;
    try {
        id = await auth.registerUser(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

    res.json({ id: id });
});

/* KOŠARICA */

app.get("/ShopingCart", async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("ShopingCart").find({})
    let result = await cursor.toArray()
    res.json(result)
})




app.delete('/ShopingCart/Auth', [auth.verify], async (req, res) => {
    let { id } = req.params
    let db = await connect()
    await db.collection("ShopingCart").deleteOne({ _id: mongo.ObjectId(id) })
    res.json({ msg: "Entry deleted" })
})



app.post('/ShopingCart', [auth.verify], async (req, res) => {
    let data = req.body;
    delete data._id;


    let db = await connect();
    let result = await db.collection("ShopingCart").insertOne(data);

    if (result && result.insertedCount == 1) {
        res.json(result.ops[0]);
    }
    else {
        res.json({
            status: "fail",
        })
    }
})
