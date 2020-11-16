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

app.post("/api/register", userController.registerNewUser);
app.post("/api/login", userController.loginUser);

app.post('/api/site-pages', sitePagesController.post);
app.get('/api/site-pages', sitePagesController.get);
app.get('/api/site-pages/:id', sitePagesController.getById);
app.put('/api/site-pages/:id', sitePagesController.put);
app.delete('/api/site-pages/:id', sitePagesController.deleteById);


app.post('/api/sites/:id/site_pages', siteCollectionsController.postToExistingSite);
app.post('/api/sites', siteCollectionsController.post);
app.get('/api/sites', siteCollectionsController.get);
app.get('/api/sites/:id', siteCollectionsController.getById);
app.put('/api/sites/:id', siteCollectionsController.put);
app.delete('/api/sites/:id',  siteCollectionsController.deleteById);
