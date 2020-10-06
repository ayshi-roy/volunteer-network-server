const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const port = 5000

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log(process.env.DB_USER)


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jmmpi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("volunteerDetails").collection("memberDetails");

  app.post('/addUser', (req, res) => {
    const newUser = req.body;
    collection.insertOne(newUser)
    .then(result => {
      res.send(result.insertedCount > 0);     
    })
    console.log(newUser);
  })

  app.get('/list', (req, res) => {    
    collection.find({email: req.query.email})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })

  app.delete('/delete/:id', (req, res) => {
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
       res.send(result.deletedCount > 0);
       
    })
    
  })

  console.log("database connected");
  
});
client.connect(err => {
  const cardDetail = client.db("volunteerDetails").collection("cardList"); 

  app.get('/showCard', (req, res) => {
      cardDetail.find({})
      .toArray( (err, documents) => {
          res.send(documents);
      })
  })

  console.log('database connected');

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)