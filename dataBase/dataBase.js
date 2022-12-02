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
        
        // let db = client.db("MyDatabase");

        // let ad = await db
        //   .collection("Vehicles")
        //   .find({ cost: { $lt: 500, $gt: 100 } })
        //   // $and:[{u1:{$gt:30}},{u1:{$lt:60}}]
        //   .toArray();
        // console.log("shsxs", ad);
      })
      .catch((err) => {
        console.log("ERROR:", err);
      });
  },
  terminate: () => client.close(),
};

module.exports = { client, connectionUtils };
