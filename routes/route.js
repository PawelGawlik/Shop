const express = require("express");
const router = express.Router();
const fs = require("fs");
const multiparty = require('multiparty');
const mongo = require("mongodb");
const client = new mongo.MongoClient("mongodb://localhost:27017");
const db = client.db("shop");
const items = db.collection("items");
const connect = (param) => {
    try {
        throw new Error("ble")
        client.connect();
    } catch (err) {
        param(err);
        return "error";
    }
}
const disconnect = () => {
    client.close();
}

router.post("/", async (req, res, next) => {
    const id = Number(req.body);
    const err = connect(next);
    if (err === "error") {
        return;
    }
    await items.deleteOne({ id });
    await items.updateMany({ id: { $gt: id } }, { $inc: { id: -1 } });
    disconnect();
    res.redirect("back");
})

router.post("/item/:param", async (req, res, next) => {
    const insFun = async (param1, param2, param3, param4) => {               // funkcja zapisująca/modyfikująca przedmiot w bazie
        if (param2 === "create") {
            const form = new multiparty.Form();
            form.parse(req, (err, fields, files) => {
                if (err) {
                    next(err);
                    return;
                }
                const ext = files.picture[0].originalFilename.split(".")[1]; // rozszerzenie pliku
                fs.readFile(files.picture[0].path, async (err, data) => {
                    if (err) {
                        next(err);
                        return;
                    }
                    const obj = {
                        id: param1,
                        name: fields.name[0],
                        picture: data,
                        source: `data:image/${ext};base64`,
                        price: fields.price[0],
                        desc: fields.desc[0]
                    }
                    const err2 = connect(next);
                    if (err2 === "error") {
                        return;
                    }
                    await items.insertOne(obj);
                    disconnect();
                    res.redirect("back");
                })
            })
        }
        if (param2 === "update") {
            const ext = param4.picture[0].originalFilename.split(".")[1]; // rozszerzenie pliku
            fs.readFile(param4.picture[0].path, async (err, data) => {
                if (err) {
                    next(err);
                    return;
                }
                const obj = {
                    id: param1,
                    name: param3.name[0],
                    picture: data,
                    source: `data:image/${ext};base64`,
                    price: param3.price[0],
                    desc: param3.desc[0]
                }
                const err2 = connect(next);
                if (err2 === "error") {
                    return;
                }
                await items.updateOne({ id: param1 }, {
                    $set: obj
                })
                disconnect();
                res.redirect("back");
            })
        }
    }
    if (req.params.param === "create") {
        const err = connect(next);
        if (err === "error") {
            return;
        }
        const itemArr = await items.find().toArray();
        disconnect();
        let id;
        if (itemArr.length) {
            id = itemArr[itemArr.length - 1].id + 1;
            insFun(id, "create");
        } else {
            id = 1;
            insFun(id, "create");
        }
    } else {
        if (req.body.picture === "") {
            const err = connect(next);
            if (err === "error") {
                return;
            }
            await items.updateOne({ id: Number(req.body.hidden) }, {
                $set: {
                    name: req.body.name,
                    price: req.body.price,
                    desc: req.body.desc
                }
            })
            disconnect();
            res.redirect("back");
        } else {
            const form = new multiparty.Form();
            form.parse(req, (err, fields, files) => {
                if (err) {
                    next(err);
                    return;
                }
                insFun(Number(fields.hidden[0]), "update", fields, files);
            })
        }
    }
})

router.get("/items", async (req, res, next) => {
    const err = connect(next);
    if (err === "error") {
        return;
    }
    const itemArr = await items.find().toArray();
    disconnect();
    res.send(itemArr);
})

router.post("/search", async (req, res, next) => {
    const reg = new RegExp(`^${req.body.trim()}`, "i");
    const err = connect(next);
    if (err === "error") {
        return;
    }
    const itemArr = await items.find({ name: reg }).toArray();
    disconnect();
    res.send(itemArr);
})

router.post("/all", async (req, res, next) => {
    let itemArr;
    const err = connect(next);
    if (err === "error") {
        return;
    }
    if (req.body === "show") {
        itemArr = await items.find().toArray();
    } else {
        await items.deleteMany();
        itemArr = [];
    }
    disconnect();
    res.send(itemArr);
})

router.post("/update", async (req, res, next) => {
    const err = connect(next);
    if (err === "error") {
        return;
    }
    const itemArr = await items.find({ id: Number(req.body) }).toArray();
    disconnect();
    res.send(itemArr[0]);
})

module.exports = router;
