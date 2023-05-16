const express = require("express");
const app = express();
const mongodb = require("mongodb");
require("dotenv").config();
const cors = require("cors");
var ObjectId = require("mongodb").ObjectId;
const port = 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.1p4oijh.mongodb.net/?retryWrites=true&w=majority`;
const client = new mongodb.MongoClient(uri, {
  serverApi: {
    version: mongodb.ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();
    const database = client.db("treesample");
    const usersTable = database.collection("users");
    // this is get
    app.get("/users", async (req, res) => {
      const alluser = usersTable.find({});
      const cursor = await alluser.toArray();
      res.json(cursor);
    });
    // single user
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const queryId = { _id: new ObjectId(id) };
      const result = await usersTable.findOne(queryId);

      res.json(result);
    });
    // this is post
    app.post("/users", async (req, res) => {
      const userdata = req.body;
      const result = await usersTable.insertOne(userdata);
      res.json(result);
    });
    // delete api
    app.delete("/users/:id", async (req, res) => {
      const deleteId = req.params.id;
      const id = { _id: new ObjectId(deleteId) };
      const result = await usersTable.deleteOne(id);
      res.json(result);
    });
  } finally {
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
