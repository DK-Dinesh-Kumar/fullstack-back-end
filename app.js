let express = require("express");
let mongodb = require("mongodb");

let app = express();
let db = null;
app.use(express.static("script"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
let dbstring =
  "mongodb+srv://dgvUser:dinesh4@cluster0.kvrf7rk.mongodb.net/MyDatabase?retryWrites=true&w=majority";
let MongoClient = mongodb.MongoClient;
let port =process.env.PORT
if(port == null || port ==""){
  port =3000
}
MongoClient.connect(
  dbstring,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    if (err) {
      throw err;
    }
    db = client.db("MyDatabase");
    app.listen(port);
  }
);
function passprotect(req, res, next) {
  res.set('www-Authenticate', 'Basic realm="sample App"');
  if ((req.headers.authorization == "Basic REs6MTIzNA==")) {
    next();
  } else {
    res.status(401).send(" Please Authenticate");
  }
}
app.get("/", passprotect, function (req, res) {
  db.collection("Vehicles")
    .find()
    .toArray(function (err, items) {
      res.send(`
    
      <form action="/answer" method="POST">
      <h4>Vehicle Details</h4>
    <label>Type <input name="type" autocomplete="off" /></label>
    <label>Company<input name="company" autocomplete="off" /></label>
    <label>Modal<input name="modal" autocomplete="off" /></label>
    <label>Cost<input name="cost" autocomplete="off" /></label>
    <label>Color<input name="color" autocomplete="off" /></label>
    
      <button style={{backgroundColor:"red"}}>Submit</button>
    </form>
    <table>
    <thead>
    <tr>
    <th>Type</th>
    <th>Company</th>
    <th>Modal</th>
    <th>Color</th>
    <th>Cost</th>
    </tr>
    </thead>
    <tbody>
    ${items.map(function (ele) {
      return `<tr style={{backgroundColor:"red",color:"white"}}>
      <td>${ele.type}</td>
      <td>${ele.company}</td>
      <td>${ele.modal}</td>
      <td>${ele.color}</td>
      <td>${ele.cost}</td>
      <td><button data-id=${ele._id} class="edit-me btn">Edit</button></td>
      <td><button data-id=${ele._id} class="delete-me">Delete</button></td>
      </tr>`;
    })}
    </tbody>
    </table>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js" integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf" crossorigin="anonymous"></script>
    <script src="/browser.js">console.log("old Script")</script>
    <script >console.log("old Script")</script>
      `);
    });
});

app.post("/answer", function (req, res) {
  db.collection("Vehicles").insertOne(
    {
      type: req.body.type,
      company: req.body.company,
      modal: req.body.modal,
      cost: req.body.cost,
      color: req.body.color,
    },
    function () {
      res.redirect("/");
    }
  );
});
app.post("/update-details", function (req, res) {
  console.log("reqqq", req);
  db.collection("Vehicles").findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.body.id) },
    { $set: { cost: req.body.text } },
    function () {
      res.redirect("/");
    }
  );
});

app.post("/delete-details", function (req, res) {
  console.log("reqqq", req);
  db.collection("Vehicles").deleteOne(
    { _id: new mongodb.ObjectId(req.body.id) },
    function () {
      res.redirect("/");
    }
  );
});
