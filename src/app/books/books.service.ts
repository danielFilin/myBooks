import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from './book.model';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient, private router: Router) {}

  private myBooks: Book[] = [];
  updatedBookList = new Subject<{books: Book[], bookCount: number}>();

  getUpdatedBookList() {
    return this.updatedBookList.asObservable();
  }

  addBook(id: null, author: string, title: string, description: string, image: File) {
    const bookData = new FormData();
    bookData.append('title', title);
    bookData.append('author', author);
    bookData.append('description', description);
    bookData.append('image', image, title);
    this.http.post<{message: string, book: Book}>('http://localhost:3000/api/books', bookData)
    .subscribe( (responseData) => {
      this.router.navigate(['/']);
    });

  }

   updateBook(id: string, author: string, title: string, description: string, image: File | string) {
      let bookData: Book | FormData;
      if (typeof(image) === 'object') {
        bookData = new FormData();
        bookData.append('id', id);
        bookData.append('title', title);
        bookData.append('author', author);
        bookData.append('description', description);
        bookData.append('image', image, title);
      }  else {
        bookData = {id, author, title, description, imagePath: image};
      }
      this.http.put('http://localhost:3000/api/books/' + id, bookData)
    .subscribe( response =>{
      this.router.navigate(['/']);
    });
  }

  getSingleBook(id: string) {
    // return {...this.myBooks.find( book => book.id === id)};
    return this.http.get<{_id: string, title: string, author: string, description: string, imagePath: string}>('http://localhost:3000/api/books/' + id);
  }

  getBooks(postsPerPage: number, currentPage: number) {
    console.log(postsPerPage);
    const queryParams = `?pagesize=${postsPerPage}&startingpage=${currentPage}`;

    this.http.get<{message: string, books: any, maxBooks: number}>('http://localhost:3000/api/books' + queryParams)
    .pipe(map ((bookData) => {
      return {books: bookData.books.map(book => {
        return {
          title: book.title,
          author: book.author,
          description: book.description,
          id: book._id,
          imagePath: book.imagePath
        };
      }), maxBooks: bookData.maxBooks};
    })
    )
    .subscribe( (updatedBookData) => {
        this.myBooks = updatedBookData.books;
        this.updatedBookList.next({
          books: [...this.myBooks],
          bookCount: updatedBookData.maxBooks
        });
    });
  }

  deleteBook(bookId: string) {
    return this.http.delete('http://localhost:3000/api/books/' + bookId);
  }

}
