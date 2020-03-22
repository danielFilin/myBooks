const express =require('express');
const multer = require('multer');

const Book = require('../models/books');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error('Invalid mime type');
      if (isValid) {
        error = null;
      }
      cb(null, 'backend/images');
    },
      filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const extension = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + '-' + Date.now() + '.' + extension);
    }
});

router.post('', checkAuth, multer({storage: fileStorage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    imagePath: url + '/images/' + req.file.filename
  });
  book.save().then(createdBook => {
    res.status(201).json({
      message: 'post added',
      book: {
        // id: createdBook._id,
        // title: createdBook.title,
        // author: createdBook.author,
        // description: createdBook.description,
        // imagePath: createdBook.imagePath
        ...createdBook,
        id: createdBook._id
      }
    });
  });
});

router.get('/:id', async (req, res, next) => {
  try {
    const fetchedBooks = await Book.findById(req.params.id);
    if (fetchedBooks) {
      res.status(200).json({
        message: 'Book fetched!',
        books: fetchedBooks
      })
    }
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
});

router.put('/:id', checkAuth, multer({storage: fileStorage}).single('image'),
async (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const book = new Book ({
    _id: req.body.id,
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    imagePath: imagePath
  })
  await Book.updateOne({_id: req.params.id}, book);
  res.status(200).json({
    message: 'update successefull',
    body: req.body
  })
});

router.get('', async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.startingpage;
    console.log(pageSize, currentPage);
    const postQuery = Book.find();

    if (pageSize && currentPage) {
      postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
    }
    const fetchedBooks = await postQuery;
    const bookCount = await Book.countDocuments();
    res.status(200).json({
      message: 'Books fetched!',
      books: fetchedBooks,
      maxBooks: bookCount
    })
  } catch (err) {
    res.status(400).json({
      statis: 'fail',
      message: err
    })
  }
});

router.delete('/:id', checkAuth, async (req, res, next) => {
  try{
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: 'Book deleted!',
    });
  } catch (err) {
    res.status(400).json({
      statis: 'fail',
      message: err
    })
  };
});

module.exports = router;
