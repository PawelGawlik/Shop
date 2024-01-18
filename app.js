const express = require("express");
const app = express();
const parser = require("body-parser");
const route = require("./routes/route");
app.listen(1000, () => {
    console.log("Serwer działa!");
})
app.use(parser.urlencoded({ extended: true }));
app.use(express.text());
app.use("/", route);
app.use(express.static("./public"));
app.get("*", (req, res) => {
    res.status(404);
    res.sendFile("error404.html", {
        root: "./public"
    })
})
app.use((err, req, res, next) => {
    console.log("error2")
    res.status(500);
    res.sendFile("error500.html", {
        root: "./public"
    })
})