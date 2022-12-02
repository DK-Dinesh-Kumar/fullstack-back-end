
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

Server.post("/send-sms", function (req, res) {
    client.messages
      .create({
        body: "Hi Dinesh",
        from: "+18305803125", //enter you phone number
        to: "+917449209192", //the number that you want to send the message //must be verified by twillio
      })
      .then((message) => {
        console.log(message),
          res.status(200).send({ message: "Msg Sended Successfully" });
      })
      .catch((err) => console.log(err));
  });
  

  
Server.post("/upload-avatar", async (req, res) => {
    console.log("reqqq", req.files.avatar);
  
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: "No file uploaded",
        });
      } else {
        //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
        let avatar = req.files.avatar;
  
        //Use the mv() method to place the file in the upload directory (i.e. "uploads")
        avatar.mv("./uploads/" + avatar.name);
  
        //send response
        res.send({
          status: true,
          message: "File is uploaded",
          data: {
            name: avatar.name,
            mimetype: avatar.mimetype,
            size: avatar.size,
          },
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  Server.use(
    fileUpload({
      createParentPath: true,
    })
  );