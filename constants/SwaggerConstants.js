
const api= ["./routes/user.js","./routes/tabledata.js"]
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: " Node JS API Project for mongodb",
      version: "1.0.0",
    },
    servers: [
      {
        url: "https://vehicles-data.onrender.com",
      },
    ],
  },
  apis:api,
};
module.exports = swaggerOptions;
