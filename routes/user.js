const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { client } = require("../dataBase/dataBase");
const randomRange = require("../helper/random");
const jwt = require("jsonwebtoken");
const Verify = require("../helper/token");
const moment = require("moment");
let db = client.db("MyDatabase");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dineshkumarddk1997@gmail.com",
    pass: "qutzimpqkjpecxmc",
  },
  tls: {
    rejectUnauthorized: false,
  },
});
/**
 * @swagger
 *  components:
 *    schemas:
 *        Generate Otp:
 *            type: object
 *            properties:
 *                userName:
 *                  type: string

 */

/**
 * @swagger
 * /user/generate-otp:
 *  post:
 *    summary: This api is Generate OTP
 *    description:  This api is Generate OTP
 *    requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                    $ref: '#components/schemas/Generate Otp'
 *    responses:
 *         200:
 *             description: To test Generte OTP method
 */

userRouter.post("/generate-otp", (req, res) => {
  console.log("Generate Otp Api");
  if (req.body.userName) {
    db.collection("UserList")
      .findOne({ $or: [{ username: req.body.userName }] })
      .then((result) => {
        if (result) {
          let toEmail = result.email;
          let userName = result.username;
          let otp = randomRange(1000, 9999);

          const mailOptions = {
            from: "dineshkumarddk1997@gmail.com", // sender address
            to: `${toEmail}`, // list of receivers
            subject: "Testing", // Subject line
            html: `<p> Your Otp</p><button style={{backgroundColor:"red"}}>${otp}</butto>`,
          };
          transporter.sendMail(mailOptions, function (err, info) {
            if (info) {
              db.collection("OTP")
                .findOne({ $or: [{ username: userName }] })
                .then((result) => {
                  db.collection("OTP")
                    .findOneAndUpdate(
                      { _id: result._id },
                      {
                        $set: {
                          username: userName,
                          otp: otp,
                          date: result.date,
                        },
                      }
                    )
                    .then(() => {
                      let token = jwt.sign(
                        { name: userName },
                        "verySecretValue",
                        {
                          expiresIn: "3m",
                        }
                      );
                      res.send({
                        message: "Otp Sended Successfully",
                        status: 200,
                        token: token,
                        otp: otp,
                      });
                    })
                    .catch((err) => {
                      res.send({
                        message: "something else wrong ",
                        status: 301,
                        err,
                      });
                    });
                })
                .catch(() => {
                  db.collection("OTP")
                    .insertOne({
                      username: userName,
                      otp: otp,
                      date: new Date(),
                    })
                    .then(() => {
                      let token = jwt.sign(
                        { name: userName },
                        "verySecretValue",
                        {
                          expiresIn: "5m",
                        }
                      );
                      res.send({
                        message: "Otp Sended Successfully",
                        status: 200,
                        token: token,
                        otp: otp,
                      });
                    })
                    .catch((err) => {
                      res.send({
                        message: "something else wrong ",
                        status: 301,
                        err,
                      });
                    });
                });
            }
          });
        }
      });
  } else {
    res.send({ message: "UserName Required", status: 300 });
  }
});

/**
 * @swagger
 *  components:
 *    schemas:
 *        Verify Otp:
 *            type: object
 *            properties:
 *                userName:
 *                  type: string
 *                otp:
 *                  type: number
 *                token:
 *                  type: string
 */

/**
 * @swagger
 * /user/verify-otp:
 *  post:
 *    summary: This api is Verify OTP
 *    description:  This api is Verify OTP
 *    requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                    $ref: '#components/schemas/Verify Otp'
 *    responses:
 *         200:
 *             description: To test Login method
 */

userRouter.post("/verify-otp", (req, res) => {
  console.log("Otp verify API");
  let pass = req.body.otp;
  console.log(req.body);
  jwt.verify(req.body.token, "verySecretValue", function (err, authData) {
    if (authData) {
      db.collection("OTP")
        .findOne({ $or: [{ username: req.body.userName }] })
        .then((user) => {
          if (user.otp.toString() == pass) {
            let currentTime = new Date(moment(new Date()).add(1, "minutes"));
            db.collection("OTP")
              .findOneAndUpdate(
                { _id: user._id },
                {
                  $set: {
                    username: user.username,
                    otp: user.otp,
                    date: currentTime,
                  },
                }
              )
              .then(() => {
                res.send({ message: "Otp verified ", status: 200 });
              })
              .catch(() => {});
          } else {
            res.send({ message: "Wrong Otp", status: 402 });
          }
        })
        .catch((error) => {
          res.status(301).send({ error });
        });
    } else {
      res.send({ messgae: "Otp expired", status: 403 });
    }
  });
});

/**
 * @swagger
 *  components:
 *    schemas:
 *        ChangePassword:
 *            type: object
 *            properties:
 *                userName:
 *                  type: string
 *                userPassword:
 *                  type: string
 */

/**
 * @swagger
 * /user/change-password:
 *  post:
 *    summary: This api is Change Password
 *    description:  This api is Change Password
 *    requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                    $ref: '#components/schemas/ChangePassword'
 *    responses:
 *         200:
 *             description: To test Login method
 */
userRouter.post("/change-password", (req, res) => {
  console.log("Change Password Api");
  var pass = req.body.userPassword;
  db.collection("OTP")
    .findOne({ $or: [{ username: req.body.userName }] })
    .then((user) => {
      if (user.date.getTime() >= new Date().getTime()) {
        db.collection("UserList")
          .findOne({ $or: [{ username: req.body.userName }] })
          .then((result) => {
            if (result) {
              bcrypt.hash(pass, 10, function (err, hash) {
                db.collection("UserList")
                  .findOneAndUpdate(
                    { _id: result._id },
                    {
                      $set: {
                        username: result.username,
                        email: result.email,
                        password: hash,
                      },
                    }
                  )
                  .then((succ) => {
                    res.status(200).send({ message: "Password Updated" });
                  })
                  .catch(() => {
                    res.status(404).send({ message: "Password Not  Updated" });
                  });
              });
            }
          });
      } else {
        res.status(402).send({ message: "Time Expired", status: 402 });
      }
    })
    .catch((err) => {
      res.status(300).send({ err });
    });
});

/**
 * @swagger
 *  components:
 *    schemas:
 *        Login:
 *            type: object
 *            properties:
 *                userName:
 *                  type: string
 *                userPassword:
 *                  type: string
 */

/**
 * @swagger
 * /user/login:
 *  post:
 *    summary: This api is used to Login
 *    description:  This api is  user to Logi
 *    requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                    $ref: '#components/schemas/Login'
 *    responses:
 *         200:
 *             description: To test Login method
 */

// Login api

userRouter.post("/login", (req, res) => {
  console.log("Login API");
  var pass = req.body.userPassword;
  if (req.body.userName !== null || req.body.userName !== "") {
    if (pass !== null || pass !== "") {
      db.collection("UserList")
        .findOne({ $or: [{ username: req.body.userName }] })
        .then((result) => {
          if (result) {
            bcrypt.compare(pass, result.password, function (err, hashedPass) {
              if (hashedPass) {
                let token = jwt.sign(
                  { name: result.username },
                  "verySecretValue",
                  {
                    expiresIn: "1h",
                  }
                );
                res.send({
                  message: "user",
                  result,
                  token: token,
                });
              } else {
                res.send({
                  message: "Password is wrong",
                  status: 402,
                });
              }
            });
          } else {
            res.send({ message: "User not Found", status: 401 });
            // res.status(401).json({ message: "User not Found" });
          }
        })
        .catch((err) => {
          res.status(300).send({ err });
        });
    } else {
      res.send({ message: "Password is Required" });
    }
  } else {
    res.send({ message: "User Name Required" });
  }
});

/**
 * @swagger
 *  components:
 *    schemas:
 *        UserRegister:
 *            type: object
 *            properties:
 *                userName:
 *                  type: string
 *                userPassword:
 *                  type: string
 *                userEmail:
 *                  type: string
 */

/**
 * @swagger
 * /user/user-register:
 *  post:
 *    summary: This api is used to Register User
 *    description:  This api is  user to Register User
 *    requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                    $ref: '#components/schemas/UserRegister'
 *    responses:
 *         200:
 *             description: To test Register method
 */

userRouter.post("/user-register", (req, res) => {
  console.log("Register Api")
  if (
    req.body.userName !== "" &&
    req.body.userName !== null &&
    req.body.userPassword !== "" &&
    req.body.userPassword !== null &&
    req.body.userEmail !== "" &&
    req.body.userEmail !== null
  ) {
    db.collection("UserList")
      .findOne({ $or: [{ username: req.body.userName }] })
      .then((result) => {
        if (result) {
          res.send({
            message: "UserName Already Exist Try Different User Name",
            status: 401,
          });
        } else {
          bcrypt.hash(req.body.userPassword, 10, function (err, hashedPass) {
            if (hashedPass) {
              db.collection("UserList").insertOne(
                {
                  username: req.body.userName,
                  password: hashedPass,
                  email: req.body.userEmail,
                },
                function (err, success) {
                  if (success) {
                    res.send({
                      message: "User Registered Successfully",
                      status: 200,
                    });
                  } else if (err) {
                    res.send(err);
                  }
                }
              );
            }
          });
        }
      });
  } else {
    res.send({ message: "Required fields are Missing", status: 401 });
  }
});

module.exports = userRouter;
