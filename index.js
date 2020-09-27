const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

// const password = "827fPZgKxa7RH6p";
const uri =
  "mongodb+srv://organicUser:827fPZgKxa7RH6p@cluster0.qebvf.mongodb.net/organicDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
  const productCollection = client.db("organicDB").collection("products");

  //read data base
  app.get("/product", (req, res) => {
    productCollection.find({}).toArray((err, doc) => {
      res.send(doc);
    });
  });

  // create database
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection.insertOne(product).then((result) => {
      res.redirect("/");
    });
  });

  // delete
  app.delete("/delete/:id", (req, res) => {
    productCollection
      .deleteOne({
        _id: ObjectId(req.params.id),
      })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });

  // Update
  app.get("/update/product/:id", (req, res) => {
    productCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, doc) => {
        res.send(doc[0]);
      });
  });

  //Update operation

  app.patch("/update/:id", (req, res) => {
    console.log(req.body.price);
    productCollection
      .updateOne(
        {
          _id: ObjectId(req.params.id),
        },
        {
          $set: {
            price: req.body.price,
            quantity: req.body.quantity,
          },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  //   client.close();
});

app.listen(3000);
