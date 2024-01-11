const express = require("express");
const router = express.Router();
const fs = require("fs");
const multiparty = require('multiparty');
const mongo = require("mongodb");
const client = new mongo.MongoClient("mongodb://localhost:27017");
const db = client.db("shop");
const main = db.collection("main");
const items = db.collection("items");
const connect = async () => {
    await client.connect()
}
const disconnect = () => {
    client.close();
}

router.post("/item", async (req, res) => {
    const insFun = (param) => {              // funkcja zapisująca przedmiot w bazie
        const form = new multiparty.Form();
        form.parse(req, (err, fields, files) => {
            const ext = files.picture[0].originalFilename.split(".")[1]; // rozszerzenie pliku
            fs.readFile(files.picture[0].path, async (err, data) => {
                connect();
                await items.insertOne({
                    id: param,
                    name: fields.name[0],
                    picture: data,
                    source: `data:image/${ext};base64`,
                    price: fields.price[0],
                    desc: fields.desc[0]
                })
                disconnect();
            })
        })
        res.redirect("back");
    }
    connect();
    const itemArr = await items.find().toArray();
    disconnect();
    const id = itemArr[itemArr.length - 1].id + 1;
    insFun(id);
})

router.get("/items", async (req, res) => {
    connect();
    const itemArr = await items.find().toArray();
    disconnect();
    res.send(itemArr);
})

router.post("/search", async (req, res) => {
    const reg = new RegExp(`^${req.body.trim()}`, "i");
    connect();
    const itemArr = await items.find({ name: reg }).toArray();
    disconnect();
    res.send(itemArr);
})
module.exports = router;
