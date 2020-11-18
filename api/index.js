let MongoClient = require('mongodb').MongoClient;

const express = require('express');
var bodyParser = require('body-parser')
const path = require('path');
const app = express();
require('dotenv').config()
const PORT = process.env.PORT || 8000;
console.log(process.env.DBURL)
async function main(args){
    const [client]= args;
   
    const users = client.db("ndws").collection("users");
    app.use(bodyParser.json());
    app.use(function(err, req, res, next){
        res.status(500).json(err);
    });

    app.use('/register', async (req, res, next) => {
        try{
            let userData = req.body;
            users.insertOne(userData);
            res.json({success:true});
        }catch(e){
            res.status(403).json(e);
        }
    })

    app.listen(PORT);
    console.log(`Server running on port ${PORT}`);

}

Promise.all([MongoClient.connect(process.env.DBURL,{ useUnifiedTopology: true } )]).then(main);

