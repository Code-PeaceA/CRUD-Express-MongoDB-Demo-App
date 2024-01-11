const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs'); //Using EJS as template engine

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb+srv://<username>:<password>@cluster.vmsa4vl.mongodb.net/?retryWrites=true&w=majority')
    .then(client => {
        console.log('Connected to Database');
        
        const db = client.db('crexmo');
        const quotesCollection = db.collection('quotes');
        

        app.use(bodyParser.urlencoded({ extended: true}));
       
        app.listen(3000, () => console.log('listening on 3000'));
        
        // app.get('/', (req, res) => {
        //     res.sendFile(__dirname + '/index.html');
        // });

        // Create / post data to MongoDB
        app.post('/quotes', (req, res) => {
            quotesCollection
                .insertOne(req.body)
                .then(result => {
                    res.redirect('/');
                })
                .catch(error => console.error(error));
        });

        app.get('/', (req, res) => {
            db.collection('quotes')
                .find()
                .toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results})
                })
                .catch(error => console.error(error))
        });

       
        
    })
    .catch(error => console.error(error));
