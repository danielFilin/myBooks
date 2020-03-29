const Book = require('../models/books');

exports.addBook = (req, res, next) => {
  try {
    const url = req.protocol + '://' + req.get('host');
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  book.save().then(createdBook => {
    console.log('on add Book')
    console.log(book.imagePath);
    res.status(201).json({
      message: 'post added',
      book: {
        ...createdBook,
        id: createdBook._id
      }
    });
  })
  } catch (err) {
    res.status(500).json({
      message: 'Post was not created'
    })
  }
}

exports.getOne = async (req, res, next) => {
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
      message: 'fetching post failed'
    })
  }
}

exports.editBook = async (req, res, next) => {
  try {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename;
      console.log('on Edit book')
      console.log(imagePath)
    }
    const book = new Book ({
      _id: req.body.id,
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      imagePath: imagePath,
      creator: req.userData.user
    })
    const updatedResult = await Book.updateOne({_id: req.params.id, creator: req.userData.userId}, book);
    if (updatedResult.n === 0) {
      throw ('User is not authorized to update');
    }
    res.status(200).json({
      message: 'update successefull',
      body: req.body
    })
  } catch (err) {
    res.status(500).json({
      message: 'fail',
      error: err
    })
  }
}

exports.getAllBooks = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.startingpage;
    const postQuery = Book.find();
    if (pageSize && currentPage) {
      postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
    }
    let filteredBooks = [];
    const fetchedBooks = await postQuery;
    if (req.query.userid != '-1') {
      fetchedBooks.forEach(element => {
        if (element.creator == req.query.userid) {
          filteredBooks.push(element);
        }
      });
    }

    const bookCount = await Book.countDocuments();
    res.status(200).json({
      message: 'Books fetched!',
      books: (req.query.userid != '-1'? filteredBooks: fetchedBooks),
      maxBooks: bookCount
    })
  } catch (err) {
    res.status(500).json({
      statis: 'fail',
      message: 'fetching posts failed'
    })
  }
}

exports.deleteBook = async (req, res, next) => {
  try{
    const deletedInfo = await Book.deleteOne({_id: req.params.id, creator: req.userData.userId});
    if (!deletedInfo.n) {
      throw ('unathorized request');
    }
    res.status(200).json({
      message: 'Book deleted!',
    });
  } catch (err) {
    res.status(400).json({
      statis: 'fail',
      message: 'post failed to delete'
    })
  };
}
