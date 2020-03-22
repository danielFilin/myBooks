const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const BooksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb+srv://filin:5vY3cIYdfmhhIELQ@cluster0-85nqo.mongodb.net/books?retryWrites=true&w=majority').then( () => {
  console.log('connected to DB');
})
.catch( ()=> {
  console.log('connectionf failed');
})

const app = express();

app.use('/images', express.static(path.join('backend/images')));

app.use(bodyParser.json());

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

module.exports = app;
