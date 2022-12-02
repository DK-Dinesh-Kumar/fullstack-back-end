const express = require("express");
const cors = require("cors");
const app = express();
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const dotEnv = require("dotenv");
const { connectionUtils } = require("./dataBase/dataBase");
// const { Server } = require("socket.io");
// const http = require("http");

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


// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5000",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`User Connected: ${socket.id}`);

//   socket.on("join_room", (data) => {
//     socket.join(data);
//     console.log(`User with ID: ${socket.id} joined room: ${data}`);
//   });

//   socket.on("send_message", (data) => {
//     socket.to(data.room).emit("receive_message", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User Disconnected", socket.id);
//   });
// });


app.listen(port, () => {
  console.log("Server Started");
  connectionUtils.init();
});