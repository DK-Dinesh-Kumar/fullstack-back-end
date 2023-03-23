const express = require("express");
const cors = require("cors");
const app = express();
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const dotEnv = require("dotenv");
const { connectionUtils } = require("./dataBase/dataBase");


dotEnv.config();

app.use(express.static("script"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const options = require("./constants/SwaggerConstants");

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

let port = process.env.PORT;

if (port == null || port == "") {
  port = 4000;
}

app.use("/", require("./routes/index"));


app.listen(port, () => {
  
  connectionUtils.init();
  console.log("Server Started",port);
});