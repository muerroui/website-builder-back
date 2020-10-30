const mongodb = require('mongodb');
let db = require('../config/keys').mongoURI;
mongodb.connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, client) {
      db = client.db()
    }
)
function post(req, res) {
    db.collection('sites').insertOne(req.body, function (
        err,
        info
    ) {
        res.json(info.ops[0])
    })
}

function postToExistingSite(req, res) {
    console.log('req', req.params.id);
    db.collection('sites')
    .findOne({ _id: new mongodb.ObjectId(req.params.id) }, function (err, item) {
        if (!item) {
            res.status(404).json({});
            return;
        }
        const existingSite = item;
        db.collection('sites').insertOne(req.body, function (
            err,
            info
        ) {
            existingSite.site_pages = existingSite.site_pages ? existingSite.site_pages: [];
            existingSite.site_pages.push(info.ops[0]);
            db.collection('sites').findOneAndUpdate(
                { _id: new mongodb.ObjectId(req.params.id) },
                { $set: existingSite },
                function () {
                    res.json(existingSite);
                    return;
                }
            )
        })
    });
}

function get(req, res) {
    db.collection('sites')
        .find()
        .toArray(function (err, items) {
            res.send(items)
        })
}

function getById(req, res) {
    db.collection('sites')
        .findOne({ _id: new mongodb.ObjectId(req.params.id) }, function (err, items) {
            res.send(items)
        })
}

function put(req, res) {
    db.collection('sites').findOneAndUpdate(
        { _id: new mongodb.ObjectId(req.params.id) },
        { $set: req.body },
        function () {
            res.send('Success updated!')
        }
    )
}

function deleteById(req, res) {
    db.collection('sites').deleteOne(
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
    postToExistingSite,
    put,
    deleteById
};