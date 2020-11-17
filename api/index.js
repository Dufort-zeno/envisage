let MongoClient = require('mongodb').MongoClient;

const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config()
const PORT = process.env.PORT || 8000;
console.log(process.env.DBURL)

async function main(args){
    const [client]= args;
   
    const users = client.db("ndws").collection("users");

    app.use('/test', async (req, res, next) => {
        let reponse = await users.findOne({});
        res.json(reponse);
    })

    app.listen(PORT);
    console.log(`Server running on port ${PORT}`);

}

Promise.all([MongoClient.connect(process.env.DBURL)]).then(main);

