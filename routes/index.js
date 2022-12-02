const express = require("express");
const routes = express.Router();

console.log("routess");

routes.use("/user", require("./user"));
routes.use("/table", require("./tabledata"));


module.exports = routes;
