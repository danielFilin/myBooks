const express =require('express');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const booksController = require('../controllers/books');

const router = express.Router();

router.post('', checkAuth, extractFile, booksController.addBook);

router.get('/:id', booksController.getOne);

router.put('/:id', checkAuth, extractFile, booksController.editBook);

router.get('', booksController.getAllBooks);

router.delete('/:id', checkAuth, booksController.deleteBook);

module.exports = router;
