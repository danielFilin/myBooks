const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const BooksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb+srv://filin:' + process.env.MONGO_ATLAS_PW + '@cluster0-85nqo.mongodb.net/books?retryWrites=true&w=majority').then( () => {
  console.log((path.join(__dirname, 'images')))
  console.log('connected to DB 22');
})
.catch( ()=> {
  console.log('connectionf failed');
})

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/', express.static(path.join(__dirname, 'books-project')));



app.use( (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Custom-Header', 'Authorization', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Headers', '*'); // do not think that it is good to allow all here, but not sure what should be allowed. Otherwise cannot post.
  res.setHeader('Access-Control-Allow-Methods',
  "GET, PUT, POST, DELETE, OPTIONS, PATCH");
  next();
});

app.use('/api/books', BooksRoutes);
app.use('/api/user', userRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'books-project', 'index.html'));
});

module.exports = app;
