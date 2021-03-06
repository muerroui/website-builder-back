const mongodb = require('mongodb')

let db = require('../config/keys').mongoURI;
mongodb.connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, client) {
      db = client.db()
    }
)
function post(req, res) {
    db.collection('site-pages').insertOne(req.body, function (
        err,
        info
    ) {
        res.json(info.ops[0])
    })
}

function get(req, res) {
    db.collection('site-pages')
        .find()
        .toArray(function (err, items) {
            res.send(items)
        })
}

function getById(req, res) {
    db.collection('site-pages')
        .findOne({ _id: new mongodb.ObjectId(req.params.id) }, function (err, items) {
            res.send(items)
        })
}

function put(req, res) {
    db.collection('site-pages').findOneAndUpdate(
        { _id: new mongodb.ObjectId(req.params.id) },
        { $set: req.body },
        function () {
            db.collection('site-pages')
            .find()
            .toArray(function (err, items) {
                res.send(items)
            })
        }
    )
}

function deleteById(req, res) {
    db.collection('site-pages').deleteOne(
        { _id: new mongodb.ObjectId(req.params.id) },
        function () {
            res.send('Successfully deleted!')
        }
    )
}

module.exports = {
    get,
    getById,
    post,
    put,
    deleteById
};