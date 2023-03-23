const express = require("express");
const tableRouter = express.Router();
const { verifytoken } = require("../helper/token");
const { client } = require("../dataBase/dataBase");

let db = client.db("MyDatabase");
let { ObjectId } = require("mongodb");

/**
 * @swagger
 *  components:
 *    schemas:
 *        VehicleAdd:
 *            type: object
 *            properties:
 *                token:
 *                  type: string
 *                type:
 *                  type: string
 *                company:
 *                  type: string
 *                modal:
 *                  type: string
 *                cost:
 *                  type: string
 *                color:
 *                  type: string
 */

/**
 * @swagger
 * /table/data-upload:
 *  post:
 *    summary: This api is used to  add new Table data
 *    description: This api is used to   add new Table data
 *    requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                    $ref: '#components/schemas/VehicleAdd'
 *    responses:
 *         200:
 *             description: To test New data upload method
 */
//upload new Data Api

tableRouter.post("/data-upload", verifytoken, (req, res) => {
  console.log("New Table data Upload Api");
  db.collection("Vehicles")
    .insertOne({
      type: req.body.type,
      company: req.body.company,
      modal: req.body.modal,
      cost: req.body.cost,
      color: req.body.color,
    })
    .then(() => {
      res.send({ message: "Data Uploaded Successfully" });
    })
    .catch((err) => {
      res.status(401).send(err);
    });
});

/**
 * @swagger
 *  components:
 *    schemas:
 *        VehicleUpdate:
 *            type: object
 *            properties:
 *                token:
 *                  type: string
 *                id:
 *                  type: string
 *                type:
 *                  type: string
 *                company:
 *                  type: string
 *                modal:
 *                  type: string
 *                cost:
 *                  type: string
 *                color:
 *                  type: string
 */

/**
 * @swagger
 * /table/update-details:
 *  put:
 *    summary: This api is used to  update Table data
 *    description: This api is used to  update Table data
 *    requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                    $ref: '#components/schemas/VehicleUpdate'
 *    responses:
 *         200:
 *             description: To test change table data method
 */
// Update data Api

tableRouter.put("/update-details", verifytoken, (req, res) => {
  console.log("Table data Update Api");
  db.collection("Vehicles")
    .updateOne(
      { _id: ObjectId(req.body.id) },
      {
        $set: {
          type: req.body.type,
          company: req.body.company,
          modal: req.body.modal,
          cost: req.body.cost,
          color: req.body.color,
        },
      }
    )
    .then((result) => {
      console.log(result);
      res.status(200).send("Data Updated Successfully");
    })
    .catch((err) => {
      res.status(401).send(err);
    });
});

/**
 * @swagger
 *  components:
 *    schemas:
 *        VehicleDelete:
 *            type: object
 *            properties:
 *                token:
 *                  type: string
 *                id:
 *                  type: string
 */

/**
 * @swagger
 * /table/delete-details:
 *  delete:
 *    summary: This api is used to  delete Table data
 *    description: This api is used to  delete Table data
 *    requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                    $ref: '#components/schemas/VehicleDelete'
 *    responses:
 *         200:
 *             description: To test delete data method
 */

// Delete data Api

tableRouter.delete("/delete-details", verifytoken, (req, res) => {
  console.log("Table data Delete Api");
  db.collection("Vehicles")
    .deleteOne({ _id: ObjectId(req.body.id) })
    .then((res) => {
      console.log(res);
      res.send({ message: "Data Removed Successfully", status: 200 });
    })
    .catch(() => {
      res.send({ message: "Something else Wrong Try again", status: 401 });
    });
});

/**
 * @swagger
 *  components:
 *    schemas:
 *        VehicleGet:
 *            type: object
 *            properties:
 *                token:
 *                  type: string
 */

/**
 * @swagger
 * /table/get-tabledata:
 *  post:
 *    summary: This api is used to  get Table data
 *    description: This api is used to  get Table data
 *    requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                    $ref: '#components/schemas/VehicleGet'
 *    responses:
 *         200:
 *             description: To test Get table data method
 */

// get data Api

tableRouter.post("/get-tabledata", verifytoken, (req, res) => {
  console.log("Table Data Get Api");
  db.collection("Vehicles")
    .find()
    .toArray()
    .then((items) => {
      res.send({ items, message: "Here Your Data", status: 200 });
    });
});

module.exports = tableRouter;
