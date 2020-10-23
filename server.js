const express = require('express')
const mongodb = require('mongodb')
const cors = require('cors')
const auth = require("./middlewares/auth")
const siteCollectionsController = require('./controllers/site.controller');
const sitePagesController = require('./controllers/site-pages.controller');
const userController = require('./controllers/user.controller');

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

app.use(cors());

app.post("/register", userController.registerNewUser);
app.post("/login", userController.loginUser);

app.post('/site-pages', sitePagesController.post);
app.get('/site-pages', sitePagesController.get);
app.get('/site-pages/:id', sitePagesController.getById);
app.put('/site-pages/:id', sitePagesController.put);
app.delete('/site-pages/:id', sitePagesController.deleteById);


app.post('/site', siteCollectionsController.post);
app.get('/site', siteCollectionsController.get);
app.get('/site/:id', siteCollectionsController.getById);
app.put('/site/:id', siteCollectionsController.put);
app.delete('/site/:id',  siteCollectionsController.deleteById);
