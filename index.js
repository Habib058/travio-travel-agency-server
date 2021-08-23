const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express()
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y0jnn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const toursCollection = client.db(`${process.env.DB_NAME}`).collection("travioTours");
  const orderedCollection = client.db(`${process.env.DB_NAME}`).collection("orderedTours");
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admin");

  app.post('/addTour', (req, res) => {
    const tour = req.body;
    toursCollection.insertOne(tour)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/tours', (req, res) => {
    toursCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
        // console.log(documents)
      })
  })

  app.get('/tour/:id', (req, res) => {
    const id = req.params.id;
    // console.log(id);
    toursCollection.find({ _id: ObjectId(id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })

  app.post('/placeOrder', (req, res) => {
    const tour = req.body;
    orderedCollection.insertOne(tour)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/orders', (req, res) => {
    orderedCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
        // console.log(documents)
      })
  })

  app.post('/userOrder', (req, res) => {
    const email = req.body.email;
    console.log(email);
    orderedCollection.find({ userEmail: email })
      .toArray((err, documents) => {
        res.send(documents);
        console.log(documents)
      })
  })
  app.post('/addAdmin',(req,res)=>{
    const admin = req.body;
    adminCollection.insertOne(admin)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port || process.env.PORT)