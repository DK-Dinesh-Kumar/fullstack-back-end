const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://dgvUser:dinesh4@cluster0.kvrf7rk.mongodb.net/MyDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri);
const connectionUtils = {
  init: () => {
    console.log("Initiating Database connection...");
    client
      .connect()
      .then(async (e) => {
        console.log(`🚀 Database connected successfully...`);
      })
      .catch((err) => {
        console.log("ERROR:", err);
      });
  },
  terminate: () => client.close(),
};

module.exports = { client, connectionUtils };
