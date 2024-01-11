const express = require("express");
const app = express();
const parser = require("body-parser");
const fs = require("fs");
const route = require("./routes/route");
app.listen(1000, () => {
    console.log("Serwer działa!");
})
app.use(parser.urlencoded({ extended: true }));
app.use(express.text());
app.use("/", route);
app.use(express.static("./public"))