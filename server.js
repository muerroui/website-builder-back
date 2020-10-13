const express = require('express')
const mongodb = require('mongodb')

const app = express()
let db = require('./config/keys').mongoURI;

mongodb.connect(
  db,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    db = client.db()
    app.listen(9000)
  }
)

app.use(express.json())

app.post('/site-pages', function (req, res) {
  // Sending request to create a data
  db.collection('site-pages').insertOne(req.body, function (
    err,
    info
  ) {
    res.json(info.ops[0])
  })
})

app.get('/site-pages', function (req, res) {
  // getting all the data
  db.collection('site-pages')
    .find()
    .toArray(function (err, items) {
      res.send(items)
    })
})

app.get('/site-pages/:id', function (req, res) {
  // getting data of one item
  db.collection('site-pages')
    .findOne({ _id: new mongodb.ObjectId(req.params.id) }, function (err, items) {
      res.send(items)
    })
})

app.put('/site-pages/:id', function (req, res) {
  // updating a data by it's ID and new value
  db.collection('site-pages').findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.params.id) },
    { $set: req.body },
    function () {
      res.send('Success updated!')
    }
  )
})

app.delete('/site-pages/:id', function (req, res) {
  // deleting a data by it's ID
  db.collection('site-pages').deleteOne(
    { _id: new mongodb.ObjectId(req.params.id) },
    function () {
      res.send('Successfully deleted!')
    }
  )
})
